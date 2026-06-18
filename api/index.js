module.exports = function (req, res) {
  res.status(200).json({ success: true, message: 'VERCEL_IS_WORKING' });
};
