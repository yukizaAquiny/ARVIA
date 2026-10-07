/* Dialog dan popup aplikasi. */
(() => {
  const ICONS = {
    info: "✦",
    success: "✓",
    warning: "!",
    danger: "!"
  };

  function showDialog(options = {}) {
    const {
      title = "ARVIA",
      message = "",
      kind = "info",
      mode = "alert",
      confirmLabel = mode === "alert" ? "Mengerti" : "Lanjutkan",
      cancelLabel = "Batal",
      inputLabel = "Jawaban",
      inputType = "text",
      placeholder = "",
      value = ""
    } = options;

    return new Promise(resolve => {
      const previousFocus = document.activeElement;
      const backdrop = document.createElement("div");
      backdrop.className = "app-dialog-backdrop";
      backdrop.setAttribute("data-dialog-backdrop", "");

      const dialog = document.createElement("section");
      dialog.className = `app-dialog app-dialog-${kind}`;
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.setAttribute("aria-labelledby", "app-dialog-title");
      dialog.setAttribute("aria-describedby", "app-dialog-message");

      const header = document.createElement("div");
      header.className = "app-dialog-header";

      const icon = document.createElement("span");
      icon.className = "app-dialog-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = ICONS[kind] || ICONS.info;

      const closeButton = document.createElement("button");
      closeButton.className = "app-dialog-close";
      closeButton.type = "button";
      closeButton.setAttribute("aria-label", "Tutup dialog");
      closeButton.textContent = "×";

      const heading = document.createElement("h2");
      heading.className = "app-dialog-title";
      heading.id = "app-dialog-title";
      heading.textContent = title;

      const copy = document.createElement("p");
      copy.className = "app-dialog-message";
      copy.id = "app-dialog-message";
      copy.textContent = message;

      header.append(icon, heading, closeButton);
      dialog.append(header, copy);

      let input = null;
      if (mode === "prompt") {
        const label = document.createElement("label");
        label.className = "app-dialog-input-label";
        label.textContent = inputLabel;
        input = document.createElement("input");
        input.className = "app-dialog-input";
        input.type = inputType;
        input.placeholder = placeholder;
        input.value = value;
        input.autocomplete = inputType === "email" ? "email" : "off";
        input.spellcheck = false;
        input.setAttribute("aria-label", inputLabel);
        dialog.append(label, input);
      }

      const actions = document.createElement("div");
      actions.className = "app-dialog-actions";

      const cancelButton = document.createElement("button");
      cancelButton.className = "app-dialog-button app-dialog-cancel";
      cancelButton.type = "button";
      cancelButton.textContent = cancelLabel;

      const confirmButton = document.createElement("button");
      confirmButton.className = "app-dialog-button app-dialog-confirm";
      confirmButton.type = "button";
      confirmButton.textContent = confirmLabel;

      if (mode !== "alert") actions.append(cancelButton);
      actions.append(confirmButton);
      dialog.append(actions);
      backdrop.append(dialog);
      document.body.append(backdrop);
      document.body.classList.add("app-dialog-open");

      let done = false;
      const cancelResult = mode === "prompt" ? null : false;
      const finish = result => {
        if (done) return;
        done = true;
        document.removeEventListener("keydown", onKeydown, true);
        backdrop.classList.add("is-closing");
        document.body.classList.remove("app-dialog-open");
        window.setTimeout(() => backdrop.remove(), 180);
        if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
        resolve(result);
      };

      const onKeydown = event => {
        if (event.key === "Escape") {
          event.preventDefault();
          finish(cancelResult);
          return;
        }
        if (event.key === "Enter" && input && document.activeElement === input) {
          event.preventDefault();
          finish(input.value.trim());
          return;
        }
        if (event.key === "Tab") {
          const focusable = [...dialog.querySelectorAll("button, input")].filter(el => !el.disabled);
          if (!focusable.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      };

      confirmButton.addEventListener("click", () => {
        finish(mode === "prompt" ? input.value.trim() : mode === "confirm");
      });
      cancelButton.addEventListener("click", () => finish(cancelResult));
      closeButton.addEventListener("click", () => finish(cancelResult));
      backdrop.addEventListener("click", event => {
        if (event.target === backdrop) finish(cancelResult);
      });
      document.addEventListener("keydown", onKeydown, true);

      requestAnimationFrame(() => {
        backdrop.classList.add("is-open");
        (input || confirmButton).focus();
      });
    });
  }

  window.AppDialogs = {
    alert: options => showDialog({ ...options, mode: "alert" }),
    confirm: options => showDialog({ ...options, mode: "confirm" }),
    prompt: options => showDialog({ ...options, mode: "prompt" })
  };
})();
