import DevelopmentControls from "../dev/ServiceControls.jsx";
export default import.meta.env.DEV ? DevelopmentControls : () => null;
