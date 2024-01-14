let optionsButtons = document.querySelectorAll(".option-button");
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let fontSizeRef = document.getElementById("fontSize");
let writingArea = document.getElementById("text-input");
let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let spacingButtons = document.querySelectorAll(".spacing");
let formatButtons = document.querySelectorAll(".format");
let scriptButtons = document.querySelectorAll(".script");
// Funciones y eventos para guardar y abrir archivos
let saveButton = document.getElementById('btnradio1');
let openButton = document.getElementById('btnradio2');

// Evento para guardar el contenido en un archivo .txt
saveButton.addEventListener('click', function () {
    let content = writingArea.textContent;  // Obtener el contenido como texto plano
    let blob = new Blob([content], { type: 'text/plain' });  // Crear un Blob de texto
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'note.txt';  // Establecer la extensión del archivo a .txt
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});


// Evento para abrir un archivo
openButton.addEventListener('click', function () {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.html, .txt'; // Aceptar archivos .html y .txt

    fileInput.onchange = e => {
        let file = e.target.files[0];

        // Verificar si el archivo es un .html o .txt
        if (file.name.endsWith('.html') || file.name.endsWith('.txt')) {
            let reader = new FileReader();
            reader.onload = function (e) {
                if (file.name.endsWith('.html')) {
                    // Si es un archivo HTML, insertar como HTML
                    writingArea.innerHTML = e.target.result;
                } else {
                    // Si es un archivo de texto, insertar como texto
                    writingArea.textContent = e.target.result;
                }
            };
            reader.readAsText(file);
        } else {
            alert("Solo se pueden abrir archivos .html o .txt");
        }
    };

    fileInput.click();
});

const modifyText = (command, defaultUi, value) => {
    document.execCommand(command, defaultUi, value);
};


let fontList = [
    "Arial",
    "Comic Sans Ms",
    "Courier New",
    "Georgia",
    "Impact",
    "Times New Roman",
    "Trebuchet MS",
    "Ubuntu",
    "Verdana"
];

let fontSizeList = [
    "8px",
    "10px",
    "12px",
    "14px",
    "18px",
    "24px",
    "36px"
];


const initializer = () => {
    highlighter(alignButtons, true);
    highlighter(spacingButtons, true);
    highlighter(formatButtons, false);
    highlighter(scriptButtons, true);

    // Añadir lógica para cambiar el tipo de encabezado
    document.getElementById("formatBlock").onchange = function() {
        let headerType = this.value;
        document.execCommand('formatBlock', false, headerType);
    };
    

    // Añadir las fuentes al select de fuentes
    fontList.forEach((font) => {
        let option = document.createElement("option");
        option.value = font;
        option.style.fontFamily = font;
        option.textContent = font;
        fontName.appendChild(option);
    });

    // Añadir tamaños de fuente al select de tamaños
    fontSizeList.forEach((size) => {
        let option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        fontSizeRef.appendChild(option);
    });

    fontSizeRef.value = "12px";
    fontName.onchange = function () {
        document.execCommand('fontName', false, fontName.value);
    };


    fontSizeRef.onchange = function () {
        // Obtener el valor seleccionado del tamaño de fuente
        let selectedFontSize = fontSizeRef.value;
        // Convertir el valor de tamaño de fuente a un índice como lo espera execCommand
        let fontSizeIndex = {
            "8px": "1",
            "10px": "2",
            "12px": "3",
            "14px": "4",
            "18px": "5",
            "24px": "6",
            "36px": "7"
        }[selectedFontSize];
        // Aplicar el cambio de tamaño de fuente solo al texto seleccionado o al punto de inserción
        document.execCommand("fontSize", false, fontSizeIndex);
    };


};

optionsButtons.forEach((button) => {
    button.addEventListener("click", () => {
        modifyText(button.id, false, null);
    });
});

advancedOptionButton.forEach((button) => {
    button.addEventListener("change", () => {
        modifyText(button.id, false, button.value);
    });
});

linkButton.addEventListener("click", () => {
    let userLink = prompt("Enter a URL?");
    if (/http/i.test(userLink)) {
        modifyText(linkButton.id, false, userLink);
    } else {
        userLink = "http://" + userLink;
        modifyText(linkButton.id, false, userLink);
    }
});

const highlighter = (className, needsRemoval) => {
    className.forEach((button) => {
        button.addEventListener("click", () => {
            if (needsRemoval) {
                let alreadyActive = false;
                if (button.classList.contains("active")) {
                    alreadyActive = true;
                }
                highlighterRemover(className);
                if (!alreadyActive) {
                    button.classList.add("active");
                }
            } else {
                button.classList.toggle("active");
            }
        });
    });
};

const highlighterRemover = (className) => {
    className.forEach((button) => {
        button.classList.remove("active");
    });
};

window.onload = initializer;