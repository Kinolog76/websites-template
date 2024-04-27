// добавление класса для того чтоюы появились чекбоксы
document.addEventListener("DOMContentLoaded", () => {
  const cases = document.querySelectorAll(".cases");
  const redactBtn = document.querySelector(".redact-list__btn");

  if (cases.length > 0 && redactBtn) {
    redactBtn.addEventListener("click", () => {
      cases.forEach((caseElem) => {
        caseElem.classList.toggle("redact");
      });
    });
  }
});

// переключение по датам
document.addEventListener("DOMContentLoaded", function () {
  const dateBoxes = document.querySelectorAll(".date__box");
  const tasks = document.querySelectorAll(".dates__tasks");

  if (dateBoxes.length === tasks.length && dateBoxes.length > 0) {
    dateBoxes.forEach(function (box, index) {
      box.addEventListener("click", function () {
        activateDate(index);
      });
    });
  }

  function activateDate(index) {
    if (index >= 0 && index < dateBoxes.length) {
      dateBoxes.forEach((box) => box.classList.remove("date_active"));
      tasks.forEach((task) => task.classList.remove("active"));

      dateBoxes[index].classList.add("date_active");
      tasks[index].classList.add("active");
    }
  }
});

// переключение Запаланировано/Выполнено
document.addEventListener("DOMContentLoaded", function () {
  const tabSets = document.querySelectorAll(".tabs__box");

  tabSets.forEach((tabSet) => {
    const scheduledTab = tabSet.querySelector(".scheduled");
    const doneTab = tabSet.querySelector(".done");
    const tasksWrapper =
      tabSet.nextElementSibling?.querySelector(".tasks__wrapper");
    const doneWrapper =
      tabSet.nextElementSibling?.querySelector(".done__wrapper");

    if (scheduledTab && doneTab && tasksWrapper && doneWrapper) {
      scheduledTab.addEventListener("click", () => {
        tasksWrapper.classList.add("active");
        doneWrapper.classList.remove("active");
        scheduledTab.classList.add("tab_active");
        doneTab.classList.remove("tab_active");
      });

      doneTab.addEventListener("click", () => {
        doneWrapper.classList.add("active");
        tasksWrapper.classList.remove("active");
        doneTab.classList.add("tab_active");
        scheduledTab.classList.remove("tab_active");
      });
    }
  });
});

// открытие/закрытия выбора "Тип дела"
document.addEventListener("DOMContentLoaded", function () {
  const caseTypeDiv = document.querySelector(".case-type__box");
  const ctpDiv = document.querySelector(".container");
  const closeButton = ctpDiv?.querySelector(".ctp__close");

  if (caseTypeDiv && ctpDiv && closeButton) {
    caseTypeDiv.addEventListener("click", function () {
      ctpDiv.classList.add("ctp_open");
    });

    closeButton.addEventListener("click", function () {
      ctpDiv.classList.remove("ctp_open");
    });
  }
});

// выбор типа дела
document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".ctp-item");
  const list = document.querySelector(".ctp-list");

  if (items.length > 0 && list) {
    items.forEach((item) => {
      item.addEventListener("click", () => {
        items.forEach((item) => item.classList.remove("selected"));
        item.classList.add("selected");
        list.insertBefore(item, list.firstChild);
      });
    });
  }
});

// функционал вывода типа дела
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".ctp-item");
  const caseTypeSelected = document.querySelector(".case-type__selected");

  if (items.length === 0 || caseTypeSelected === null) {
    return;
  }

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const selectedValue = item.getAttribute("data-value");
      caseTypeSelected.className = "case-type__selected " + selectedValue;
    });
  });
});

// открытие/закрытия выбора "Сотрудники"
document.addEventListener("DOMContentLoaded", function () {
  const employee = document.querySelector(".emp-type__box");
  const empDiv = document.querySelector(".container");
  const closeButton = empDiv?.querySelector(".emp__close");

  if (employee && empDiv && closeButton) {
    employee.addEventListener("click", function () {
      empDiv.classList.add("emp_open");
    });

    closeButton.addEventListener("click", function () {
      empDiv.classList.remove("emp_open");
    });
  }
});

// выбор сотрудника
document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".emp-item");
  const list = document.querySelector(".emp-list");

  if (items.length > 0 && list) {
    items.forEach((item) => {
      item.addEventListener("click", () => {
        items.forEach((item) => item.classList.remove("selected"));
        item.classList.add("selected");
        list.insertBefore(item, list.firstChild);
      });
    });
  }
});

// функционал вывода типа дела
document.addEventListener("DOMContentLoaded", function () {
  const empItems = document.querySelectorAll(".emp-item");
  const empSelected = document.querySelector(".emp__selected");
  const empSelectedImg = document.querySelector(".emp__selected-img");
  const empFIOInput = document.getElementById("empFIO");

  if (empItems && empSelected && empSelectedImg && empFIOInput) {
    empItems.forEach((item) => {
      item.addEventListener("click", () => {
        const selectedValue = item.getAttribute("data-value");
        const selectedImgSrc = item
          .querySelector(".emp-img img")
          .getAttribute("src");
        const selectedFIO = item.querySelector(".emp-fio").textContent;

        empSelected.textContent = selectedValue;
        empSelectedImg.src = selectedImgSrc;
        empFIOInput.value = selectedFIO;
      });
    });
  }
});

// функционал выбора времени напоминания
document.addEventListener("DOMContentLoaded", function () {
  // Находим все наборы элементов
  const selectBoxes = document.querySelectorAll(".rm__select_box");

  selectBoxes.forEach((selectBox) => {
    const dropdown = selectBox.querySelector(".rm__dropdown");
    const reminderValue = selectBox.querySelector(".reminder-value");
    const dropdownItems = dropdown.querySelectorAll("li");

    if (dropdownItems.length > 0) {
      // По умолчанию значение "Нет"
      let selectedValue = "Нет";
      reminderValue.textContent = selectedValue;

      // Показываем/скрываем выпадающий список при клике
      selectBox.addEventListener("click", () => {
        dropdown.style.display =
          dropdown.style.display === "block" ? "none" : "block";
      });

      // Обрабатываем выбор значения из выпадающего списка
      dropdownItems.forEach((item) => {
        item.addEventListener("click", () => {
          // Удаляем класс selected у всех элементов списка
          dropdownItems.forEach((item) => {
            item.classList.remove("selected");
          });

          selectedValue = item.textContent;
          reminderValue.textContent = selectedValue;
          item.classList.add("selected"); // Добавляем класс selected к выбранному элементу
          dropdown.style.display = "none";
        });
      });

      // Закрываем выпадающий список при клике вне него
      document.addEventListener("click", (event) => {
        if (
          !selectBox.contains(event.target) &&
          event.target !== reminderValue
        ) {
          dropdown.style.display = "none";
        }
      });
    }
  });
});

// функционал добавление напоминаний
document.addEventListener("DOMContentLoaded", () => {
  const selectBoxes = document.querySelectorAll(".rm__select_box");
  const addButton = document.querySelector(".rm__add_box");
  const maxSelectBoxes = 4;
  let currentVisible = 1; // Первый rm__select_box уже виден

  // Обработчик клика по кнопке "Добавить"
  addButton.addEventListener("click", () => {
    if (currentVisible < maxSelectBoxes) {
      selectBoxes[currentVisible].style.display = "flex";
      currentVisible++;

      if (currentVisible >= maxSelectBoxes) {
        addButton.style.display = "none";
      }
    }
  });

  // Устанавливаем значение по умолчанию в reminder-value
  selectBoxes.forEach((box) => {
    const dropdown = box.querySelector(".rm__dropdown");
    const reminderValue = box.querySelector(".reminder-value");
    const selectedDefault = dropdown.querySelector(".selected");

    reminderValue.textContent = selectedDefault.textContent;

    // Обработчик выбора значения из выпадающего списка
    const dropdownItems = dropdown.querySelectorAll("li");

    dropdownItems.forEach((item) => {
      item.addEventListener("click", () => {
        dropdownItems.forEach((item) => item.classList.remove("selected"));
        item.classList.add("selected");
        reminderValue.textContent = item.textContent;

        // Закрываем выпадающий список после выбора значения
        dropdown.style.display = "none";
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const caseTypeSelected = document.querySelector(".case-type__selected");
  const ctpList = document.querySelector(".ctp-list");

  if (caseTypeSelected && !caseTypeSelected.classList.contains("nothing")) {
    caseTypeSelected.addEventListener("click", function () {
      const selectedClass = caseTypeSelected.classList[1];
      const selectedElement = document.querySelector(
        `[data-value="${selectedClass}"]`
      );

      if (selectedElement) {
        ctpList.prepend(selectedElement);

        const ctpItems = document.querySelectorAll(".ctp-item");
        ctpItems.forEach(function (item) {
          if (item === selectedElement) {
            item.classList.add("selected");
          } else {
            item.classList.remove("selected");
          }
        });
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const empSelected = document.querySelector(".emp__selected");
  const empSelectedImg = document.querySelector(".emp__selected-img");
  const empFIOInput = document.getElementById("empFIO");
  const empItems = document.querySelectorAll(".emp-item");
  const empList = document.querySelector(".emp-list");

  if (empSelected && empSelectedImg && empFIOInput && empItems && empList) {
    const selectedText = empSelected.textContent.toLowerCase();

    empItems.forEach((item) => {
      const dataValue = item.getAttribute("data-value");
      if (dataValue && selectedText.includes(dataValue.toLowerCase())) {
        item.classList.add("selected");
        const imgSrc = item.querySelector(".emp-img img").getAttribute("src");
        empSelectedImg.src = imgSrc;

        const empFIO = item.querySelector(".emp-fio").textContent;
        empFIOInput.value = empFIO;
      }
    });

    const selectedEmp = empList.querySelector(".selected");
    if (selectedEmp) {
      empList.prepend(selectedEmp);
    }
  }
});
