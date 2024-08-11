console.log("CreaftingProcessor loaded")
class CreaftingProcessor {
    exportDatapack() {
        return ""
    }
    exportKubeJS() {
        return ""
    }
}
document.getElementById("crafting-is2x2").addEventListener("change", () => {
    console.log(document.getElementById("crafting-is2x2").checked)
    document.getElementById("crafting-input-top-right").disabled = document.getElementById("crafting-is2x2").checked;
    document.getElementById("crafting-input-middle-right").disabled = document.getElementById("crafting-is2x2").checked;
    document.getElementById("crafting-input-bottom-right").disabled = document.getElementById("crafting-is2x2").checked;
    document.getElementById("crafting-input-bottom-middle").disabled = document.getElementById("crafting-is2x2").checked;
    document.getElementById("crafting-input-bottom-left").disabled = document.getElementById("crafting-is2x2").checked;
    

})