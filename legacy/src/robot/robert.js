export function initRobert() {
  console.log("Robert initialisé ✅");

  return {
    name: "Robert",
    status: "idle",
    speak(text) {
      console.log("Robert dit :", text);
    }
  };
}
