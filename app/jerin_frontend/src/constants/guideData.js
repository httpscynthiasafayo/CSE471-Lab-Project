// Relational data structure for guides

export const GUIDE_DATA = {
  'United States': {
    universities: {
      'Harvard University': {
        programs: ['Computer Science', 'Business Administration (MBA)', 'Medicine', 'Law', 'Psychology', 'Economics', 'Biology', 'Physics', 'Mathematics'],
        departments: ['School of Engineering and Applied Sciences', 'Harvard Business School', 'Harvard Medical School', 'Harvard Law School', 'Faculty of Arts and Sciences'],
        terms: ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026'],
        degreeTypes: ['Bachelors', 'Masters', 'PhD']
      },
      'MIT (Massachusetts Institute of Technology)': {
        programs: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Aerospace Engineering', 'Artificial Intelligence', 'Data Science', 'Physics', 'Mathematics'],
        departments: ['School of Engineering', 'School of Science', 'Sloan School of Management', 'School of Architecture and Planning'],
        terms: ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026'],
        degreeTypes: ['Bachelors', 'Masters', 'PhD']
      },
      'Stanford University': {
        programs: ['Computer Science', 'Electrical Engineering', 'Business Administration (MBA)', 'Medicine', 'Law', 'Psychology', 'Economics', 'Artificial Intelligence'],
        departments: ['School of Engineering', 'Graduate School of Business', 'School of Medicine', 'School of Law', 'School of Humanities and Sciences'],
        terms: ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026'],
        degreeTypes: ['Bachelors', 'Masters', 'PhD']
      },
      'Carnegie Mellon University': {
        programs: ['Computer Science', 'Software Engineering', 'Electrical Engineering', 'Robotics', 'Artificial Intelligence', 'Data Science', 'Business Administration (MBA)'],
        departments: ['School of Computer Science', 'College of Engineering', 'Tepper School of Business', 'Heinz College'],
        terms: ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026'],
        degreeTypes: ['Bachelors', 'Masters', 'PhD']
      }
    }
  },
  'Canada': {
    universities: {
      'University of Toronto': {
        programs: ['Computer Science', 'Engineering', 'Business Administration (MBA)', 'Medicine', 'Law', 'Psychology', 'Economics', 'Biology', 'Physics'],
        departments: ['Faculty of Applied Science & Engineering', 'Rotman School of Management', 'Faculty of Medicine', 'Faculty of Law', 'Faculty of Arts & Science'],
        terms: ['Fall 2024', 'Winter 2025', 'Summer 2025', 'Fall 2025'],
        degreeTypes: ['Bachelors', 'Masters', 'PhD']
      },
      'University of Waterloo': {
        programs: ['Computer Science', 'Software Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Mathematics', 'Statistics', 'Business Administration'],
        departments: ['Faculty of Engineering', 'Faculty of Mathematics', 'Conrad School of Entrepreneurship and Business', 'Faculty of Science'],
        terms: ['Fall 2024', 'Winter 2025', 'Spring 2025', 'Fall 2025'],
        degreeTypes: ['Bachelors', 'Masters', 'PhD']
      }
    }
  },
  'United Kingdom': {
    universities: {
      'University of Oxford': {
        programs: ['Computer Science', 'Engineering', 'Business Administration (MBA)', 'Medicine', 'Law', 'Psychology', 'Economics', 'Physics', 'Mathematics'],
        departments: ['Department of Computer Science', 'Department of Engineering Science', 'Said Business School', 'Medical Sciences Division', 'Faculty of Law'],
        terms: ['Fall 2024', 'Winter 2025', 'Spring 2025', 'Fall 2025'],
        degreeTypes: ['Bachelors', 'Masters', 'PhD']
      },
      'University of Cambridge': {
        programs: ['Computer Science', 'Engineering', 'Business Administration (MBA)', 'Medicine', 'Law', 'Psychology', 'Economics', 'Physics', 'Mathematics'],
        departments: ['Department of Computer Science and Technology', 'Department of Engineering', 'Judge Business School', 'School of Clinical Medicine', 'Faculty of Law'],
        terms: ['Fall 2024', 'Winter 2025', 'Spring 2025', 'Fall 2025'],
        degreeTypes: ['Bachelors', 'Masters', 'PhD']
      }
    }
  },
  'Australia': {
    universities: {
      'University of Melbourne': {
        programs: ['Computer Science', 'Engineering', 'Business Administration (MBA)', 'Medicine', 'Law', 'Psychology', 'Economics', 'Architecture'],
        departments: ['Melbourne School of Engineering', 'Melbourne Business School', 'Melbourne Medical School', 'Melbourne Law School', 'Faculty of Arts'],
        terms: ['Semester 1 2024', 'Semester 2 2024', 'Semester 1 2025', 'Semester 2 2025'],
        degreeTypes: ['Bachelors', 'Masters', 'PhD']
      },
      'Australian National University': {
        programs: ['Computer Science', 'Engineering', 'Business Administration (MBA)', 'Law', 'Psychology', 'Economics', 'International Relations', 'Physics'],
        departments: ['College of Engineering and Computer Science', 'ANU College of Business and Economics', 'ANU College of Law', 'College of Arts and Social Sciences'],
        terms: ['Semester 1 2024', 'Semester 2 2024', 'Semester 1 2025', 'Semester 2 2025'],
        degreeTypes: ['Bachelors', 'Masters', 'PhD']
      }
    }
  }
}

// Helper functions to get data based on selections
export const getCountries = () => Object.keys(GUIDE_DATA)

export const getUniversities = (country) => {
  if (!country || !GUIDE_DATA[country]) return []
  return Object.keys(GUIDE_DATA[country].universities)
}

export const getPrograms = (country, university) => {
  if (!country || !university || !GUIDE_DATA[country]?.universities[university]) return []
  return GUIDE_DATA[country].universities[university].programs
}

export const getDepartments = (country, university) => {
  if (!country || !university || !GUIDE_DATA[country]?.universities[university]) return []
  return GUIDE_DATA[country].universities[university].departments
}

export const getTerms = (country, university) => {
  if (!country || !university || !GUIDE_DATA[country]?.universities[university]) return []
  return GUIDE_DATA[country].universities[university].terms
}

export const getDegreeTypes = (country, university) => {
  if (!country || !university || !GUIDE_DATA[country]?.universities[university]) return []
  return GUIDE_DATA[country].universities[university].degreeTypes
}

// Get all unique values for filtering
export const getAllUniversities = () => {
  const universities = []
  Object.values(GUIDE_DATA).forEach(countryData => {
    universities.push(...Object.keys(countryData.universities))
  })
  return [...new Set(universities)]
}

export const getAllPrograms = () => {
  const programs = []
  Object.values(GUIDE_DATA).forEach(countryData => {
    Object.values(countryData.universities).forEach(uni => {
      programs.push(...uni.programs)
    })
  })
  return [...new Set(programs)]
}

export const getAllDepartments = () => {
  const departments = []
  Object.values(GUIDE_DATA).forEach(countryData => {
    Object.values(countryData.universities).forEach(uni => {
      departments.push(...uni.departments)
    })
  })
  return [...new Set(departments)]
}

export const getAllTerms = () => {
  const terms = []
  Object.values(GUIDE_DATA).forEach(countryData => {
    Object.values(countryData.universities).forEach(uni => {
      terms.push(...uni.terms)
    })
  })
  return [...new Set(terms)]
}

export const getAllDegreeTypes = () => {
  const degreeTypes = []
  Object.values(GUIDE_DATA).forEach(countryData => {
    Object.values(countryData.universities).forEach(uni => {
      degreeTypes.push(...uni.degreeTypes)
    })
  })
  return [...new Set(degreeTypes)]
}
