const dashboardService = require("../services/dashboard.service");

const showSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getDashboardSummary(req.user.id);

    return res.status(200).json({
      summary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showSummary,
};
