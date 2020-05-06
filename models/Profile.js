const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  avatar: {
    type: String
  },
  projects: [
    {
      name: {
        type: String
      },
      color: {
        type: String // hex code
      },
      status: {
        type: String,
        default: 'Active'
      },
      archived: {
        type: Boolean,
        default: false
      },
      comments: [
        {
          body: {
            type: String
          }
        }
      ],
      tasks: [
        {
          project_id: {
            type: String
          },
          project_name: {
            type: String
          },
          project_color: {
            type: String
          },
          body: {
            type: String
          },
          due: {
            type: Date
          },
          priority: {
            type: String
          },
          priority_color: {
            type: String
          },
          isActive: {
            type: Boolean,
            default: true
          },
        }
      ]
    }
  ]
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
