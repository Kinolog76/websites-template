// ! backoffice функционал
const officeButton = document.querySelector(".office-button");
const officeTable = document.querySelector(".backoffice-table-box");
const officeInputs = document.querySelectorAll(".office-input__edit");
const officeCheckboxes = document.querySelectorAll(".inp-checkbox");

function toggleInputsState() {
  const isEditMode = officeTable.classList.contains("edit");

  for (let i = 0; i < officeInputs.length; i++) {
    if (isEditMode) {
      officeInputs[i].removeAttribute("disabled");
    } else {
      officeInputs[i].setAttribute("disabled", "true");
    }
  }

  if (!isEditMode) {
    officeCheckboxes.forEach(function (checkbox) {
      checkbox.setAttribute("disabled", "true");
      const deleteButton = checkbox.parentElement.querySelector(".delete-btn");
      deleteButton.style.display = "none";
    });
  } else {
    officeCheckboxes.forEach(function (checkbox) {
      checkbox.removeAttribute("disabled");
      const deleteButton = checkbox.parentElement.querySelector(".delete-btn");

      checkbox.addEventListener("change", function () {
        if (this.checked) {
          deleteButton.style.display = "block";
        } else {
          deleteButton.style.display = "none";
        }
      });
    });
  }
}

function updateButtonText() {
  if (officeTable.classList.contains("edit")) {
    officeButton.textContent = "Сохранить";
  } else {
    officeButton.textContent = "Редактировать";
  }
}

officeButton.addEventListener("click", function () {
  officeTable.classList.toggle("edit");
  toggleInputsState();
  updateButtonText();
});

toggleInputsState();
updateButtonText();

// ! GGI функционал
const ggiButton = document.querySelector(".ggi-button");
const ggiTable = document.querySelector(".ggi-table-box");
const ggiInputs = document.querySelectorAll(".ggi-input__edit");
const ggiCheckboxes = document.querySelectorAll(".inp-checkbox");

function ggiToggleInputsState() {
  const isEditMode = ggiTable.classList.contains("edit");

  for (let i = 0; i < ggiInputs.length; i++) {
    if (isEditMode) {
      ggiInputs[i].removeAttribute("disabled");
    } else {
      ggiInputs[i].setAttribute("disabled", "true");
    }
  }

  if (!isEditMode) {
    ggiCheckboxes.forEach(function (checkbox) {
      checkbox.setAttribute("disabled", "true");
      const deleteButton = checkbox.parentElement.querySelector(".delete-btn");
      deleteButton.style.display = "none";
    });
  } else {
    ggiCheckboxes.forEach(function (checkbox) {
      checkbox.removeAttribute("disabled");
      const deleteButton = checkbox.parentElement.querySelector(".delete-btn");

      checkbox.addEventListener("change", function () {
        if (this.checked) {
          deleteButton.style.display = "block";
        } else {
          deleteButton.style.display = "none";
        }
      });
    });
  }
}

function ggiUpdateButtonText() {
  if (ggiTable.classList.contains("edit")) {
    ggiButton.textContent = "Сохранить";
  } else {
    ggiButton.textContent = "Редактировать";
  }
}

ggiButton.addEventListener("click", function () {
  ggiTable.classList.toggle("edit");
  ggiToggleInputsState();
  ggiUpdateButtonText();
});

ggiToggleInputsState();
ggiUpdateButtonText();

// ! GGART функционал
const ggartButton = document.querySelector(".ggart-button");
const ggartTable = document.querySelector(".ggart-table-box");
const ggartInputs = document.querySelectorAll(".ggart-input__edit");
const ggartCheckboxes = document.querySelectorAll(".inp-checkbox");

function ggartToggleInputsState() {
  const isEditMode = ggartTable.classList.contains("edit");

  for (let i = 0; i < ggartInputs.length; i++) {
    if (isEditMode) {
      ggartInputs[i].removeAttribute("disabled");
    } else {
      ggartInputs[i].setAttribute("disabled", "true");
    }
  }

  if (!isEditMode) {
    ggartCheckboxes.forEach(function (checkbox) {
      checkbox.setAttribute("disabled", "true");
      const deleteButton = checkbox.parentElement.querySelector(".delete-btn");
      deleteButton.style.display = "none";
    });
  } else {
    ggartCheckboxes.forEach(function (checkbox) {
      checkbox.removeAttribute("disabled");
      const deleteButton = checkbox.parentElement.querySelector(".delete-btn");

      checkbox.addEventListener("change", function () {
        if (this.checked) {
          deleteButton.style.display = "block";
        } else {
          deleteButton.style.display = "none";
        }
      });
    });
  }
}

function ggartUpdateButtonText() {
  if (ggartTable.classList.contains("edit")) {
    ggartButton.textContent = "Сохранить";
  } else {
    ggartButton.textContent = "Редактировать";
  }
}

ggartButton.addEventListener("click", function () {
  ggartTable.classList.toggle("edit");
  ggartToggleInputsState();
  ggartUpdateButtonText();
});

ggartToggleInputsState();
ggartUpdateButtonText();

// ! GAME функционал
const gameButton = document.querySelector(".game-button");
const gameTable = document.querySelector(".game-table-box");
const gameInputs = document.querySelectorAll(".game-input__edit");
const gameCheckboxes = document.querySelectorAll(".inp-checkbox");

function gameToggleInputsState() {
  const isEditMode = gameTable.classList.contains("edit");

  for (let i = 0; i < gameInputs.length; i++) {
    if (isEditMode) {
      gameInputs[i].removeAttribute("disabled");
    } else {
      gameInputs[i].setAttribute("disabled", "true");
    }
  }

  if (!isEditMode) {
    gameCheckboxes.forEach(function (checkbox) {
      checkbox.setAttribute("disabled", "true");
      const deleteButton = checkbox.parentElement.querySelector(".delete-btn");
      deleteButton.style.display = "none";
    });
  } else {
    gameCheckboxes.forEach(function (checkbox) {
      checkbox.removeAttribute("disabled");
      const deleteButton = checkbox.parentElement.querySelector(".delete-btn");

      checkbox.addEventListener("change", function () {
        if (this.checked) {
          deleteButton.style.display = "block";
        } else {
          deleteButton.style.display = "none";
        }
      });
    });
  }
}

function gameUpdateButtonText() {
  if (gameTable.classList.contains("edit")) {
    gameButton.textContent = "Сохранить";
  } else {
    gameButton.textContent = "Редактировать";
  }
}

gameButton.addEventListener("click", function () {
  gameTable.classList.toggle("edit");
  gameToggleInputsState();
  gameUpdateButtonText();
});

gameToggleInputsState();
gameUpdateButtonText();

// ! DEBT функционал
const debtButton = document.querySelector(".debt-button");
const debtTable = document.querySelector(".debt-table-box");
const debtInputs = document.querySelectorAll(".debt-input__edit");
const debtCheckboxes = document.querySelectorAll(".inp-checkbox");

function debtToggleInputsState() {
  const isEditMode = debtTable.classList.contains("edit");

  for (let i = 0; i < debtInputs.length; i++) {
    if (isEditMode) {
      debtInputs[i].removeAttribute("disabled");
    } else {
      debtInputs[i].setAttribute("disabled", "true");
    }
  }

  if (!isEditMode) {
    debtCheckboxes.forEach(function (checkbox) {
      checkbox.setAttribute("disabled", "true");
      const deleteButton = checkbox.parentElement.querySelector(".delete-btn");
      deleteButton.style.display = "none";
    });
  } else {
    debtCheckboxes.forEach(function (checkbox) {
      checkbox.removeAttribute("disabled");
      const deleteButton = checkbox.parentElement.querySelector(".delete-btn");

      checkbox.addEventListener("change", function () {
        if (this.checked) {
          deleteButton.style.display = "block";
        } else {
          deleteButton.style.display = "none";
        }
      });
    });
  }
}

function debtUpdateButtonText() {
  if (debtTable.classList.contains("edit")) {
    debtButton.textContent = "Сохранить";
  } else {
    debtButton.textContent = "Редактировать";
  }
}

debtButton.addEventListener("click", function () {
  debtTable.classList.toggle("edit");
  debtToggleInputsState();
  debtUpdateButtonText();
});

debtToggleInputsState();
debtUpdateButtonText();
  