const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const Application = require('../models/Application');
const Certificate = require('../models/Certificate');
const Announcement = require('../models/Announcement');
const Internship = require('../models/Internship');

// @desc Admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const activeVolunteers = await Volunteer.countDocuments({ status: 'Active' });
    const newRegistrations = await User.countDocuments({
      role: 'volunteer',
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    const totalApplications = await Application.countDocuments();
    const pendingCertificates = await Certificate.countDocuments({ status: 'Pending' });

    // Cities covered
    const cities = await Volunteer.distinct('city');

    // Volunteers by city (top 7)
    const volunteersByCity = await Volunteer.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 7 }
    ]);

    // Skills distribution (top 8)
    const skillsDist = await Volunteer.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    // Applications by category
    const appsByCategory = await Application.aggregate([
      {
        $lookup: {
          from: 'internships',
          localField: 'internship',
          foreignField: '_id',
          as: 'internship'
        }
      },
      { $unwind: '$internship' },
      { $group: { _id: '$internship.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly registrations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyReg = await User.aggregate([
      { $match: { role: 'volunteer', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = monthlyReg.map(r => ({
      label: `${months[r._id.month - 1]} ${r._id.year}`,
      count: r.count
    }));

    res.json({
      success: true,
      stats: {
        totalVolunteers,
        activeVolunteers,
        newRegistrations,
        totalApplications,
        pendingCertificates,
        citiesCovered: cities.length
      },
      charts: {
        volunteersByCity: volunteersByCity.map(v => ({ city: v._id || 'Unknown', count: v.count })),
        skillsDistribution: skillsDist.map(s => ({ skill: s._id || 'Other', count: s.count })),
        applicationsByCategory: appsByCategory.map(a => ({ category: a._id || 'Other', count: a.count })),
        monthlyRegistrations: monthlyData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
