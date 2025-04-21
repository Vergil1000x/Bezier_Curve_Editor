function applyBezier(a, b, c, d) {
  // Clamp inputs as in original script
  a = Math.max(0.001, Math.min(1, a)); // Clamp a to [0.001, 1]
  c = Math.min(0.999, c); // Clamp c to [0, 0.999]

  var comp = app.project.activeItem;
  if (comp && comp instanceof CompItem) {
      var props = comp.selectedProperties;
      if (props.length > 0) {
          app.beginUndoGroup("Apply Dynamic Eases");
          var noSelectedKeyframes = true;
          for (var p = 0; p < props.length; p++) {
              var prop = props[p];
              if (prop.numKeys > 0 && prop.selectedKeys.length > 1) {
                  noSelectedKeyframes = false;
                  var selectedKeys = prop.selectedKeys.sort(function (a, b) {
                      return a - b;
                  });
                  for (var i = 0; i < selectedKeys.length - 1; i++) {
                      var keyIndex1 = selectedKeys[i];
                      var keyIndex2 = selectedKeys[i + 1];
                      var keyValue1 = prop.keyValue(keyIndex1);
                      var keyValue2 = prop.keyValue(keyIndex2);
                      var keyTime1 = prop.keyTime(keyIndex1);
                      var keyTime2 = prop.keyTime(keyIndex2);
                      var timeDiff = Math.abs(keyTime2 - keyTime1);
                      var dim = typeof keyValue1 === "number" ? 1 : keyValue1.length;
                      var inEase = [];
                      var outEase = [];
                      for (var j = 0; j < dim; j++) {
                          var val1 = dim === 1 ? keyValue1 : keyValue1[j];
                          var val2 = dim === 1 ? keyValue2 : keyValue2[j];
                          var avSpeed = timeDiff !== 0 ? Math.abs(val1 - val2) / timeDiff : 0;
                          var speed1 = (avSpeed * b) / a;
                          var speed2 = (avSpeed * (1 - d)) / (1 - c);
                          var influence1 = a * 100;
                          var influence2 = (1 - c) * 100;
                          outEase.push(new KeyframeEase(speed1, influence1));
                          inEase.push(new KeyframeEase(speed2, influence2));
                      }
                      prop.setTemporalEaseAtKey(
                          keyIndex1,
                          prop.keyInTemporalEase(keyIndex1),
                          outEase
                      );
                      prop.setTemporalEaseAtKey(
                          keyIndex2,
                          inEase,
                          prop.keyOutTemporalEase(keyIndex2)
                      );
                  }
              }
          }
          app.endUndoGroup();
          if (noSelectedKeyframes) {
              return "Please select at least two keyframes in the chosen properties.";
          }
      } else {
          return "Please select at least one property.";
      }
  } else {
      return "Please open a composition.";
  }
  return "";
}