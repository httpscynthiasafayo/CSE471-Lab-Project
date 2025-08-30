import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Property from '../models/Property.js';
import requireAuth from '../middleware/requireAuth.js';
import requireAdmin from '../middleware/requireAdmin.js';
import User from '../models/User.js';
// import { sendOwnerContactEmail } from "../services/emailService.js";
import multer from 'multer';
import path from 'path';
import bodyParser from "body-parser";
import Bookmark from '../models/Bookmark.js';
import Notification from '../models/Notification.js';
import sendEmail from '../utils/sendEmail.js';

import { sendOwnerContactEmail } from '../services/emailService.js';

const router = express.Router();

// -------- helpers --------
const ensureCanManage = (req, property, currentUser) => {
  const isAdmin = currentUser?.role === "admin";
  const byId = property.ownerId && String(property.ownerId) === String(currentUser?.id);
  const byEmail =
    property.ownerEmail &&
    currentUser?.email &&
    property.ownerEmail.toLowerCase() === currentUser.email.toLowerCase();
  return isAdmin || byId || byEmail;
};

// dynamic storage per property
// const storage = multer.diskStorage({
//   destination: (req, _file, cb) => {
//     const dir = path.join(process.cwd(), "uploads", "property", req.params.id);
//     fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (_req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, name);
//   },
// });

const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage, limits: { fileSize: 6 * 1024 * 1024 } });


// const upload = multer({
//   storage,
//   limits: { fileSize: 6 * 1024 * 1024 }, // 6MB per image
//   fileFilter: (_req, file, cb) => {
//     if (!/image\/(jpe?g|png|webp|gif)/i.test(file.mimetype)) {
//       return cb(new Error("Only image files are allowed"));
//     }
//     cb(null, true);
//   },
// });

// POST /api/properties/:id/photos  (form-data: photos[])
// landowner (owner) or admin only
// router.post("/:id/photos", requireAuth, upload.array("photos", 10), async (req, res, next) => {
//   try {
//     const property = await Property.findById(req.params.id);
//     if (!property) return res.status(404).json({ error: "Property not found" });
//     if (!ensureCanManage(req, property, req.user)) return res.status(403).json({ error: "Forbidden" });

//     const relPaths = (req.files || []).map(
//       (f) => `/uploads/property/${property._id}/${f.filename}`
//     );
//     property.photos = [...(property.photos || []), ...relPaths];
//     await property.save();
//     res.json({ ok: true, photos: property.photos });
//   } catch (err) {
//     next(err);
//   }
// });

// DELETE /api/properties/:id/photos/:filename
router.delete("/:id/photos/:filename", requireAuth, async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    if (!ensureCanManage(req, property, req.user)) return res.status(403).json({ error: "Forbidden" });

    const filename = req.params.filename;
    const fileAbs = path.join(process.cwd(), "uploads", "property", req.params.id, filename);
    property.photos = (property.photos || []).filter((p) => !p.endsWith(`/${filename}`));
    await property.save();

    fs.promises.unlink(fileAbs).catch(() => {}); // ignore if missing
    res.json({ ok: true, photos: property.photos });
  } catch (err) {
    next(err);
  }
});

// PUT /api/properties/:id/photos/order  (body: { order: [ "fileA.jpg", "fileB.jpg", ... ] })
router.put("/:id/photos/order", requireAuth, async (req, res, next) => {
  try {
    const { order } = req.body || {};
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Property not found" });
    if (!ensureCanManage(req, property, req.user)) return res.status(403).json({ error: "Forbidden" });
    if (!Array.isArray(order)) return res.status(400).json({ error: "order must be an array" });

    // rebuild using provided filenames
    const map = new Map(
      (property.photos || []).map((url) => [url.split("/").pop(), url])
    );
    const nextPhotos = [];
    order.forEach((fname) => {
      const url = map.get(fname);
      if (url) nextPhotos.push(url);
    });
    // add any missing leftovers at the end
    property.photos.forEach((url) => {
      if (!nextPhotos.includes(url)) nextPhotos.push(url);
    });

    property.photos = nextPhotos;
    await property.save();
    res.json({ ok: true, photos: property.photos });
  } catch (err) {
    next(err);
  }
});
// POST /api/properties/:id/request-contact
router.post("/:id/request-contact", requireAuth, async (req, res, next) => {
  try {
    // only students should request contact
    if (req.user?.role && req.user.role !== "user") {
      return res.status(403).json({ error: "Only students can request owner contact." });
    }

    const property = await Property.findById(req.params.id).lean();
    if (!property) return res.status(404).json({ error: "Property not found" });
console.log({property});
    // find owner from ownerId or ownerEmail
    let owner = null;
    if (property.ownerId) owner = await User.findById(property.ownerId).lean();
    else if (property.ownerEmail) owner = await User.findOne({ email: property.ownerEmail }).lean();
    if (!owner) return res.status(404).json({ error: "Land Owner not found" });

    const student = await User.findById(req.user.id).lean();
    if (!student?.email) return res.status(400).json({ error: "Student email not found" });

    const result = await sendOwnerContactEmail({
      to: student.email,
      property: { title: property.title, location: property.location },
      owner: { phone: owner.phone, whatsappUrl: owner.whatsappUrl, socialUrl: owner.socialUrl },
      student: { name: student.name },
    });

    res.json({ ok: true, previewUrl: result.previewUrl || null });
  } catch (err) {
    next(err);
  }
});
// Middleware to check if user is the property owner or an admin
const requirePropertyOwnerOrAdmin = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    // Check if the user is an admin or the property owner
    if (req.user.role === 'admin' || property.landownerId.toString() === req.user.id) {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET all properties (no changes here)

router.get('/', async (req, res) => {
  const { location, type, maxPrice, duration } = req.query;
  const filter = {};
  if (location) filter.location = new RegExp(location, 'i');
  if (type) filter.type = type;
  if (maxPrice) filter.price = { $lte: Number(maxPrice) };
  if (duration && duration !== 'Flexible') { // Only filter by duration if it's not "Flexible"
    filter.duration = duration;
  }
  // The "Flexible" option should show all properties
  if (duration === 'Flexible') {
    // No filter for duration, so all properties will match
  }
  try {
    const props = await Property.find(filter).sort({ createdAt: -1 });
    res.json(props);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});
// GET a specific property by ID
router.get('/:id', async (req, res) => {
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(prop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// NEW: GET properties for a specific landowner
router.get('/landowner/my-properties', requireAuth, async (req, res) => {
  try {
    const props = await Property.find({ landownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(props);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch landowner properties' });
  }
});

// POST a new property (allowed for verified landowners and admins)
router.post('/',  uploadMemory.single("photo"),  requireAuth, async (req, res) => {
  try {
    // Only verified landowners can create properties
    const user = await User.findById(req.user.id);
    if (user.role === 'landowner' && user.isLandownerVerified) {
      const prop = await Property.create({
        ...req.body,
        landownerId: req.user.id // Automatically set the landowner ID
      });
      console.log(`🏠 New property created: ${prop.title} (${prop.location})`);

      // Notify users with bookmarks
      const bookmarks = await Bookmark.find({ itemType: 'PROPERTY' }).populate('user');
      console.log(`🔖 Found ${bookmarks.length} property bookmarks`);
      for (const bookmark of bookmarks) {
        if (!bookmark.user) {
          console.log(`Skipping bookmark with missing user: ${bookmark._id}`);
          continue;
        }
        // Send notification
        await Notification.create({
          user: bookmark.user._id,
          message: `A new property matching your bookmark location (${prop.location}) has been created.`,
          type: 'property',
          property: prop._id,
          isRead: false,
        });

        // Send email
        try {
          await sendEmail(
            bookmark.user.email,
            'New Property Available',
            `A new property in ${prop.location} matches your bookmark!`
          );
          console.log(`Email sent to ${bookmark.user.email}`);
        } catch (emailErr) {
          console.error(`Error sending email to ${bookmark.user.email}:`, emailErr);
        }
      }
      return res.status(201).json(prop);
    } else {
      return res.status(403).json({ error: 'Forbidden: Only verified landowners can create properties' });
    }
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// PUT to update a property (allowed for property owner or admin)
router.put('/:id', requireAuth, requirePropertyOwnerOrAdmin, async (req, res) => {
  try {
    const prop = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(prop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// DELETE a property (allowed for property owner or admin)
router.delete('/:id', requireAuth, requirePropertyOwnerOrAdmin, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete property' });
  }
});
// POST /api/properties/:id/request-contact
router.post("/:id/request-contact", requireAuth, async (req, res, next) => {
  try {
    // Only students can request (not admin, not landowner)
    if (req.user?.role && req.user.role !== "student") {
      return res.status(403).json({ error: "Only students can request owner contact." });
    }

    const property = await Property.findById(req.params.id).lean();
    if (!property) return res.status(404).json({ error: "Property not found" });

    // Find owner by ownerId OR ownerEmail
    let owner = null;
    if (property.ownerId) {
      owner = await User.findById(property.ownerId).lean();
    } else if (property.ownerEmail) {
      owner = await User.findOne({ email: property.ownerEmail }).lean();
    }
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    // The student (current user)
    const student = await User.findById(req.user.id).lean();
    if (!student?.email) return res.status(400).json({ error: "Student email not found" });

    const result = await sendOwnerContactEmail({
      to: student.email,
      property: { title: property.title, location: property.location },
      owner: { phone: owner.phone, whatsappUrl: owner.whatsappUrl, socialUrl: owner.socialUrl },
      student: { name: student.name },
    });

    res.json({ ok: true, previewUrl: result.previewUrl || null });
  } catch (err) {
    next(err);
  }
});

export default router;
