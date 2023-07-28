export const CCType = (name) => {
  switch(name) {
    case "visa":
      return "VI";
    case "mastercard":
      return "MC";
    case "american-express":
      return "AE";
    case "discover":
      return "DI";
    case "diners-club":
      return "DI";
    case "jcb":
      return "JCB"
    case "maestro":
      return "MI";
    default:
      return "OT";
  }
};