const calcRadiusInRadian = (dis, unit) => {
  let radius;
  switch (unit) {
    case "m":
      return (radius = dis / 6371000); // earth redius in  meters
    case "mi":
      // form mile ➡ meter
      return (radius = (dis * 1609.344) / 6371000);
    case "km":
      return (radius = (dis * 1000) / 6371000);
  }
};

module.exports = calcRadiusInRadian;
