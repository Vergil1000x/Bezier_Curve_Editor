document.addEventListener("DOMContentLoaded", function () {
  // Initialize CSInterface for CEP
  var csInterface = new CSInterface();

  function Cubic() {
    console.log("Initializing Cubic...");
    var el = document.getElementById("cubic");
    if (!el) {
      console.error("Canvas element with ID 'cubic' not found.");
      return;
    }
    this.output = document.getElementById("cubicOut");
    this.bezierInput = document.getElementById("cubic-bezier");
    this.error = document.getElementById("bezierError");
    this.applyButton = document.getElementById("applyBezier");
    this.copyButton = document.getElementById("copyBezier");
    this.applyToAEButton = document.getElementById("applyToAE");
    this.pathEg = document.getElementById("pathEg");
    this.playButton = document.getElementById("playAnimation");
    this.timeInput = document.getElementById("timeInput");
    this.presetList = document.getElementById("presetList");
    this.cubicHold = document.querySelector(".cubicHold");
    this.c = el.getContext("2d");
    if (!this.c) {
      console.error("Failed to get 2D context for canvas.");
      return;
    }

    // Initialize theme
    document.body.classList.add("dark-theme");
    this.themeButton = document.getElementById("themeButton");
    this.themeButton.addEventListener(
      "click",
      function () {
        console.log("Toggling theme...");
        if (document.body.classList.contains("dark-theme")) {
          document.body.classList.remove("dark-theme");
          document.body.classList.add("light-theme");
          this.themeButton.textContent = "Switch to Dark Theme";
        } else {
          document.body.classList.remove("light-theme");
          document.body.classList.add("dark-theme");
          this.themeButton.textContent = "Switch to Light Theme";
        }
        this.draw();
      }.bind(this)
    );

    // Initialize canvas size
    this.w = this.cubicHold.clientWidth;
    this.h = this.w; // Maintain square aspect ratio
    this.updateCanvasSize();

    // Initialize points in logical (pixel) coordinates
    this.point1 = { x: this.w * 0.5, y: this.h }; // (0.5, 0)
    this.point2 = { x: this.w * 0, y: this.h * 0 }; // (0, 1)
    this.dragging = false;
    this.closest = 1;
    this.sliderState = 0; // 0: left, 1: right
    this.selectedPreset = null; // Track selected preset

    // Load presets
    this.loadPresets();

    // Event listeners for dragging
    el.addEventListener(
      "mousedown",
      function (e) {
        console.log("Mouse down at:", e.offsetX, e.offsetY);
        this.dragging = true;
        this.setClosest(e.offsetX, e.offsetY);
        this.deselectPreset();
        e.preventDefault();
        return false;
      }.bind(this)
    );

    document.addEventListener(
      "mouseup",
      function (e) {
        console.log("Mouse up");
        this.dragging = false;
        e.preventDefault();
        return false;
      }.bind(this)
    );

    document.addEventListener(
      "mousemove",
      function (e) {
        if (!this.dragging) return;
        var rect = el.getBoundingClientRect(),
          offsetX =
            document.body.scrollLeft || document.documentElement.scrollLeft,
          offsetY =
            document.body.scrollTop || document.documentElement.scrollTop,
          canvasX = e.pageX - (rect.left + offsetX),
          canvasY = e.pageY - (rect.top + offsetY);

        // Convert canvas coordinates to logical coordinates
        var pos = this.canvasToLogical(canvasX, canvasY);

        // Clamp x-coordinate to [0, w] (Bezier x: [0, 1])
        pos.x = Math.max(0, Math.min(this.w, pos.x));

        console.log("Moving to logical:", pos.x, pos.y);
        if (this.closest === 1) this.point1 = pos;
        else this.point2 = pos;
        this.draw();
        e.preventDefault();
        return false;
      }.bind(this)
    );

    // Apply button event listener
    this.applyButton.addEventListener(
      "click",
      function () {
        console.log("Apply button clicked");
        this.deselectPreset();
        this.applyBezierValues();
      }.bind(this)
    );

    // Copy button event listener
    this.copyButton.addEventListener(
      "click",
      function () {
        var curve = this.output.textContent;
        // Try navigator.clipboard first (modern browsers)
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(curve).then(
            () => {
              console.log(
                "Copied to clipboard via navigator.clipboard:",
                curve
              );
              this.error.textContent = "Copied!";
              setTimeout(() => {
                this.error.textContent = "";
              }, 1000);
            },
            (err) => {
              console.warn("navigator.clipboard failed:", err);
              // Fallback to document.execCommand
              this.fallbackCopy(curve);
            }
          );
        } else {
          // Fallback for environments without navigator.clipboard (e.g., AE)
          console.log("navigator.clipboard unavailable, using fallback");
          this.fallbackCopy(curve);
        }
      }.bind(this)
    );

    // Apply to AE button event listener
    this.applyToAEButton.addEventListener(
      "click",
      function () {
        console.log("Apply to AE button clicked");
        var input = this.bezierInput.value.trim();
        var values = input.split(",").map((v) => v.trim());
        if (values.length !== 4) {
          this.error.textContent =
            "Enter four numbers separated by commas (e.g., 0,-1,1,1)";
          this.bezierInput.classList.add("invalid");
          console.log("Invalid input format for AE");
          return;
        }

        var a = parseFloat(values[0]);
        var b = parseFloat(values[1]);
        var c = parseFloat(values[2]);
        var d = parseFloat(values[3]);

        var errors = [];
        if (isNaN(a) || a < 0 || a > 1) {
          errors.push("a must be between 0 and 1");
        }
        if (isNaN(b)) {
          errors.push("b must be a number");
        }
        if (isNaN(c) || c < 0 || c > 1) {
          errors.push("c must be between 0 and 1");
        }
        if (isNaN(d)) {
          errors.push("d must be a number");
        }

        if (errors.length > 0) {
          this.error.textContent = errors.join("; ");
          this.bezierInput.classList.add("invalid");
          console.log("Validation errors for AE:", errors);
          return;
        }

        // Construct the ExtendScript call
        var script = `applyBezier(${a}, ${b}, ${c}, ${d});`;
        csInterface.evalScript(
          script,
          function (result) {
            console.log("ExtendScript result:", result);
            if (result && result !== "undefined") {
              this.error.textContent = result;
              this.bezierInput.classList.add("invalid");
            } else {
              this.error.textContent = "Applied to After Effects!";
              setTimeout(() => {
                this.error.textContent = "";
              }, 1000);
            }
          }.bind(this)
        );
      }.bind(this)
    );

    // Play button event listener
    this.playButton.addEventListener(
      "click",
      function () {
        console.log("Play button clicked, sliderState:", this.sliderState);
        this.playAnimation();
      }.bind(this)
    );

    // Time input event listener
    this.timeInput.addEventListener(
      "input",
      function () {
        console.log("Time input changed to:", this.timeInput.value);
        this.updateAnimation();
      }.bind(this)
    );

    // Update state after animation ends
    this.pathEg.addEventListener(
      "transitionend",
      function () {
        console.log("Animation ended, current sliderState:", this.sliderState);
        this.sliderState = this.sliderState === 0 ? 1 : 0;
        console.log("New sliderState:", this.sliderState);
      }.bind(this)
    );

    // Resize handler
    window.addEventListener(
      "resize",
      function () {
        console.log("Window resized");
        this.updateCanvasSize();
        // Adjust points to stay within new bounds
        this.point1.x = Math.max(0, Math.min(this.w, this.point1.x));
        this.point2.x = Math.max(0, Math.min(this.w, this.point2.x));
        this.draw();
      }.bind(this)
    );

    console.log("Drawing initial graph...");
    this.draw();
  }

  // Fallback copy method using document.execCommand
  Cubic.prototype.fallbackCopy = function (text) {
    try {
      // Create a temporary textarea
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed"; // Avoid scrolling
      textarea.style.opacity = "0"; // Hide element
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      var success = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (success) {
        console.log("Copied to clipboard via execCommand:", text);
        this.error.textContent = "Copied!";
        setTimeout(() => {
          this.error.textContent = "";
        }, 1000);
      } else {
        throw new Error("document.execCommand('copy') failed");
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
      this.error.textContent = "Failed to copy";
    }
  };

  Cubic.prototype.loadPresets = function () {
    fetch("../graphs.json")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load graphs.json");
        return response.json();
      })
      .then((data) => {
        console.log("Presets loaded:", data);
        data.forEach((preset) => {
          const button = document.createElement("button");
          button.className = "presetButton";
          button.textContent = preset.label;
          button.title = preset.tooltip;
          button.dataset.bezier = preset.bezier;
          button.addEventListener("click", () => {
            console.log("Preset selected:", preset.label);
            this.selectPreset(preset, button);
          });
          this.presetList.appendChild(button);
        });
      })
      .catch((error) => {
        console.error("Error loading presets:", error);
        this.error.textContent = "Failed to load presets";
      });
  };

  Cubic.prototype.selectPreset = function (preset, button) {
    // Update Bezier input
    this.bezierInput.value = preset.bezier;
    // Apply Bezier values
    this.applyBezierValues();
    // Update selected preset
    if (this.selectedPreset) {
      this.selectedPreset.button.classList.remove("selected");
    }
    this.selectedPreset = { preset, button };
    button.classList.add("selected");
    console.log("Selected preset:", preset.label, "Bezier:", preset.bezier);
  };

  Cubic.prototype.deselectPreset = function () {
    if (this.selectedPreset) {
      this.selectedPreset.button.classList.remove("selected");
      this.selectedPreset = null;
      console.log("Preset deselected");
    }
  };

  Cubic.prototype.updateCanvasSize = function () {
    console.log("Updating canvas size...");
    this.w = this.cubicHold.clientWidth;
    this.h = this.w; // Maintain square aspect ratio
    this.c.canvas.width = this.w;
    this.c.canvas.height = this.h;
    console.log("New canvas size:", this.w, this.h);
  };

  Cubic.prototype.getLogicalBounds = function () {
    // Convert pixel coordinates to Bezier coordinates
    var x1 = this.point1.x / this.w;
    var y1 = 1 - this.point1.y / this.h;
    var x2 = this.point2.x / this.w;
    var y2 = 1 - this.point2.y / this.h;

    // Define logical bounds in Bezier coordinate system
    var minX = 0; // Fixed due to x-clamping
    var maxX = 1; // Fixed due to x-clamping
    var minY = Math.min(0, y1, y2, 1);
    var maxY = Math.max(0, y1, y2, 1);

    // Ensure 1x1 aspect ratio by using the larger range
    var xRange = maxX - minX; // Always 1
    var yRange = maxY - minY;
    var range = Math.max(xRange, yRange, 1); // Minimum range of 1

    // Center the square bounds around (0.5, 0.5) in Bezier space
    minX = 0.5 - range / 2;
    maxX = 0.5 + range / 2;
    minY = 0.5 - range / 2;
    maxY = 0.5 + range / 2;

    // Add 10% padding
    range = maxX - minX;
    minX -= range * 0.1;
    maxX += range * 0.1;
    minY -= range * 0.1;
    maxY += range * 0.1;

    return { minX, maxX, minY, maxY, range: maxX - minX };
  };

  Cubic.prototype.logicalToCanvas = function (x, y) {
    var bounds = this.getLogicalBounds();
    var range = bounds.range;

    // Calculate scale to fit the square logical range in the canvas
    var scale = (this.w * 0.8) / range; // Use 80% of canvas width to leave padding
    var offsetX = (this.w - range * scale) / 2; // Center horizontally
    var offsetY = (this.h - range * scale) / 2; // Center vertically

    // Map Bezier coordinates to canvas pixels
    var canvasX = (x - bounds.minX) * scale + offsetX;
    var canvasY = (bounds.maxY - y) * scale + offsetY; // Flip y-axis

    return { x: canvasX, y: canvasY };
  };

  Cubic.prototype.canvasToLogical = function (canvasX, canvasY) {
    var bounds = this.getLogicalBounds();
    var range = bounds.range;

    // Calculate scale and offsets
    var scale = (this.w * 0.8) / range;
    var offsetX = (this.w - range * scale) / 2;
    var offsetY = (this.h - range * scale) / 2;

    // Map canvas pixels to Bezier coordinates
    var x = (canvasX - offsetX) / scale + bounds.minX;
    var y = bounds.maxY - (canvasY - offsetY) / scale;

    // Convert to pixel coordinates for internal storage
    return {
      x: x * this.w,
      y: (1 - y) * this.h,
    };
  };

  Cubic.prototype.applyBezierValues = function () {
    // Get input value
    var input = this.bezierInput.value.trim();
    // Clear previous error state
    this.bezierInput.classList.remove("invalid");
    this.error.textContent = "";

    // Parse input (expecting "a,b,c,d")
    var values = input.split(",").map((v) => v.trim());
    if (values.length !== 4) {
      this.error.textContent =
        "Enter four numbers separated by commas (e.g., 0,-1,1,1)";
      this.bezierInput.classList.add("invalid");
      console.log("Invalid input format");
      return;
    }

    var a = parseFloat(values[0]);
    var b = parseFloat(values[1]);
    var c = parseFloat(values[2]);
    var d = parseFloat(values[3]);

    // Validate inputs
    var errors = [];
    if (isNaN(a) || a < 0 || a > 1) {
      errors.push("a must be between 0 and 1");
    }
    if (isNaN(b)) {
      errors.push("b must be a number");
    }
    if (isNaN(c) || c < 0 || c > 1) {
      errors.push("c must be between 0 and 1");
    }
    if (isNaN(d)) {
      errors.push("d must be a number");
    }

    if (errors.length > 0) {
      this.error.textContent = errors.join("; ");
      this.bezierInput.classList.add("invalid");
      console.log("Validation errors:", errors);
      return;
    }

    // Update control points
    this.point1.x = a * this.w;
    this.point1.y = (1 - b) * this.h;
    this.point2.x = c * this.w;
    this.point2.y = (1 - d) * this.h;

    console.log("Applied Bezier values:", { a, b, c, d });
    this.draw();
  };

  Cubic.prototype.playAnimation = function () {
    console.log("Starting animation, sliderState:", this.sliderState);
    // Remove both classes
    this.pathEg.classList.remove("left", "right");
    // Force reflow
    void this.pathEg.offsetWidth;
    // Apply new class based on sliderState
    if (this.sliderState === 0) {
      this.pathEg.classList.add("right");
    } else {
      this.pathEg.classList.add("left");
    }
  };

  Cubic.prototype.updateAnimation = function () {
    var x1 = this.point1.x / this.w,
      y1 = 1 - this.point1.y / this.h,
      x2 = this.point2.x / this.w,
      y2 = 1 - this.point2.y / this.h;
    var curve = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
    var duration = parseFloat(this.timeInput.value) || 2; // Fallback to 2s

    // Update transition
    this.pathEg.style.transition = `left ${duration}s ${curve}`;
    // Ensure correct initial position
    this.pathEg.classList.remove("left", "right");
    this.pathEg.classList.add(this.sliderState === 0 ? "left" : "right");
    console.log(
      "Animation updated:",
      curve,
      `${duration}s`,
      "sliderState:",
      this.sliderState
    );
  };

  Cubic.prototype.draw = function () {
    console.log("Drawing canvas...");
    var bounds = this.getLogicalBounds();
    console.log("Logical bounds:", bounds);

    // Get theme-based colors
    var styles = getComputedStyle(document.body);
    var bgColor = styles.getPropertyValue("--panel-bg").trim();
    var gridColor = styles.getPropertyValue("--grid-color").trim();
    var borderColor = styles.getPropertyValue("--border-color").trim();

    // Clear canvas
    this.c.fillStyle = bgColor;
    this.c.fillRect(0, 0, this.w, this.h);

    // Draw infinite grid in Bezier coordinate system
    this.c.beginPath();
    var gridSpacing = 0.1; // Grid lines every 0.1 Bezier units
    var scale = (this.w * 0.8) / bounds.range;
    var offsetX = (this.w - bounds.range * scale) / 2;
    var offsetY = (this.h - bounds.range * scale) / 2;

    // Calculate Bezier coordinate range to cover the canvas
    var bezierMinX = bounds.minX - offsetX / scale;
    var bezierMaxX = bounds.minX + (this.w - offsetX) / scale;
    var bezierMinY = bounds.maxY - (this.h - offsetY) / scale;
    var bezierMaxY = bounds.maxY + offsetY / scale;

    // Round to nearest gridSpacing to align lines
    var startX = Math.floor(bezierMinX / gridSpacing) * gridSpacing;
    var startY = Math.floor(bezierMinY / gridSpacing) * gridSpacing;

    // Draw vertical lines
    for (var x = startX; x <= bezierMaxX; x += gridSpacing) {
      var start = this.logicalToCanvas(x, bezierMinY);
      var end = this.logicalToCanvas(x, bezierMaxY);
      this.c.moveTo(start.x, start.y);
      this.c.lineTo(end.x, end.y);
    }

    // Draw horizontal lines
    for (var y = startY; y <= bezierMaxY; y += gridSpacing) {
      var start = this.logicalToCanvas(bezierMinX, y);
      var end = this.logicalToCanvas(bezierMaxX, y);
      this.c.moveTo(start.x, start.y);
      this.c.lineTo(end.x, end.y);
    }

    this.c.strokeStyle = gridColor;
    this.c.lineWidth = 1;
    this.c.stroke();

    // Draw square border around the [0, 1] x [0, 1] Bezier curve box
    var bottomLeft = this.logicalToCanvas(0, 0); // (0, 0) in Bezier
    var topRight = this.logicalToCanvas(1, 1); // (1, 1) in Bezier
    this.c.beginPath();
    this.c.rect(
      bottomLeft.x,
      topRight.y,
      topRight.x - bottomLeft.x,
      bottomLeft.y - topRight.y
    );
    this.c.strokeStyle = borderColor;
    this.c.lineWidth = 3; // Increased for visibility
    this.c.stroke();

    // Draw curve
    var start = this.logicalToCanvas(0, 0); // (0, 0) in Bezier
    var cp1 = this.logicalToCanvas(
      this.point1.x / this.w,
      1 - this.point1.y / this.h
    );
    var cp2 = this.logicalToCanvas(
      this.point2.x / this.w,
      1 - this.point2.y / this.h
    );
    var end = this.logicalToCanvas(1, 1); // (1, 1) in Bezier
    this.c.beginPath();
    this.c.moveTo(start.x, start.y);
    this.c.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    this.c.strokeStyle = "#f00";
    this.c.lineWidth = 2;
    this.c.stroke();

    // Draw vectors
    this.c.beginPath();
    var v1Start = this.logicalToCanvas(0, 0);
    this.c.moveTo(v1Start.x, v1Start.y);
    this.c.lineTo(cp1.x, cp1.y);
    var v2Start = this.logicalToCanvas(1, 1);
    this.c.moveTo(v2Start.x, v2Start.y);
    this.c.lineTo(cp2.x, cp2.y);
    this.c.strokeStyle = "#66f";
    this.c.lineWidth = 1;
    this.c.stroke();

    // Draw points
    this.c.beginPath();
    this.c.arc(cp1.x, cp1.y, 4, 0, Math.PI * 2);
    this.c.arc(cp2.x, cp2.y, 4, 0, Math.PI * 2);
    this.c.fillStyle = "#00f";
    this.c.fill();

    // Update output and input
    var x1 = Math.round((this.point1.x / this.w) * 100) / 100,
      y1 = Math.round((1 - this.point1.y / this.h) * 100) / 100,
      x2 = Math.round((this.point2.x / this.w) * 100) / 100,
      y2 = Math.round((1 - this.point2.y / this.h) * 100) / 100;
    var curve = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
    this.output.textContent = curve;
    this.bezierInput.value = `${x1}, ${y1}, ${x2}, ${y2}`;

    // Update animation
    this.updateAnimation();
    console.log("Curve updated:", curve);
  };

  Cubic.prototype.setClosest = function (canvasX, canvasY) {
    var pos = this.canvasToLogical(canvasX, canvasY);
    // Clamp x-coordinate for distance calculation
    pos.x = Math.max(0, Math.min(this.w, pos.x));
    var point1Dist = Math.sqrt(
      Math.pow(pos.x - this.point1.x, 2) + Math.pow(pos.y - this.point1.y, 2)
    );
    var point2Dist = Math.sqrt(
      Math.pow(pos.x - this.point2.x, 2) + Math.pow(pos.y - this.point2.y, 2)
    );
    this.closest = point1Dist < point2Dist ? 1 : 2;
    console.log("Closest point:", this.closest);
  };

  try {
    new Cubic();
  } catch (e) {
    console.error("Error initializing Cubic:", e);
  }
});
