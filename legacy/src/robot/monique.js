export function initMonique() {
  console.log("Monique initialisée ✅");

  return {
    name: "Monique",
    status: "idle",
    speak(text) {
      console.log("Monique dit :", text);
    }
  };
}
