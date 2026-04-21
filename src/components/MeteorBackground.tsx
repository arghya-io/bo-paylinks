import moonBg from "@/assets/moon-bg.jpg";

const MeteorBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <img
      src={moonBg}
      alt=""
      className="absolute bottom-0 left-0 w-[60vw] max-w-[500px] opacity-[0.12] select-none"
      style={{ filter: "grayscale(1) brightness(0.8)" }}
    />
  </div>
);

export default MeteorBackground;
