// Get current datetime
const getCurrentDateTime = () => {
    return new Date().toJSON().substring(0, 19).replace('T', ' ');
  }

  module.exports = getCurrentDateTime