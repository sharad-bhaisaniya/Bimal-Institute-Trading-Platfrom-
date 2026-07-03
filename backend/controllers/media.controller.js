const Media = require('../models/Media');

exports.getAllMedia = async (req, res) => {
  try {
    const mediaList = await Media.find().sort({ createdAt: -1 });
    res.status(200).json({ data: mediaList });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching media', error });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    await media.deleteOne();
    // Ideally we should also delete the actual file from the uploads/ directory using fs.unlinkSync
    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting media', error });
  }
};
