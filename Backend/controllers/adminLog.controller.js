import AdminLog from '../models/AdminLog.js';

export const createLog = async (userId, action, targetType = 'system', targetId = null, ip = null, details = null) => {
  try {
    await AdminLog.create({
      user_id: userId,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      ip_address: ip
    });
  } catch (err) {
    console.error('AdminLog write error:', err.message);
  }
};

export const getLogs = async (req, res) => {
  try {
    const { target_type, user_id, page = 1, limit = 20 } = req.query;
    const query = {};

    if (target_type) query.target_type = target_type;
    if (user_id) query.user_id = user_id;

    const skip = (page - 1) * limit;

    const logs = await AdminLog.find(query)
      .populate('user_id', 'name email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AdminLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};