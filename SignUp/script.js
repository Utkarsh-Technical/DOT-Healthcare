        function openNav() {
          document.getElementById("mySidenav").style.width = "500px";
          document.getElementById("mySidenav").style.height = "125px";
        }
    
        function closeNav() {
          document.getElementById("mySidenav").style.width = "0";
          document.getElementById("mySidenav").style.height = "0";
        }

        function _colornum(color) {
          var l = color.length;
          return [
          parseInt(color.slice(l - 6, l - 4), 16),
          parseInt(color.slice(l - 4, l - 2), 16),
          (color.slice(l - 2, l - 0), 16)
          ];
          }
          
          function gradient(x, ranges) {
          if (x <= ranges[0][0]) {
          return ranges[0][1];
          }
          if (x >= ranges[ranges.length - 1][0]) {
          return ranges[ranges.length - 1][1];
          }
          for (var i = 0, range; range = ranges[i]; i++) {
          var start = range[0],
          color = range[1];
          if (x < start) {
          break;
          }
          }
          var p = (x - ranges[i - 1][0]) / (ranges[i][0] - ranges[i - 1][0]);
          var a = _colornum(ranges[i - 1][1]);
          var b = _colornum(ranges[i][1]);
          return 'rgb(' +
          Math.round((a[0] * (1.0 - p) + b[0] * p)) + ',' +
          Math.round((a[1] * (1.0 - p) + b[1] * p)) + ',' +
          Math.round((a[2] * (1.0 - p) + b[2] * p)) + ')';
          }
          
          var GRADIENTS = {
          'increasing': [
          [0, '#ff4142'],
          [0.5, '#ffd026'],
          [1, '#aae817']
          ],
          'decreasing': [
          [0, '#aae817'],
          [0.5, '#ffd026'],
          [1, '#ff4142']
          ]
          };
          var GRADIENT = GRADIENTS.increasing;
          
          // SPECIAL BOI - Data
          
          function renderData(data) {
          for (var key in data) {
          var modKey = String(key);
          modKey = modKey.split(' ').join('_');
          keyShow = key;
          if ((modKey == "Aurangabad_Maharastra") || (modKey == "Aurangabad_Bihar")) {
          keyShow = "Aurangabad";
          }
          if (modKey == "DIST_NA") {
          continue;
          }
          var flag = 0;
          try {
          document.getElementById(modKey).style.fill = gradient(1 - data[key].value, GRADIENT);
          $("#" + modKey + " title").text(keyShow + ' | Infected: ' + data[key].infected + ' | Deaths: ' + data[key]
          .dead);
          $("#" + modKey).attr("title", keyShow + ' | Infected: ' + data[key].infected + ' | Deaths: ' + data[key]
          .dead);
          flag = 1;
          } catch (err) {
          var a = 1 + 1;
          }
          
          
          if (flag == 0) {
          try {
          var allClasses = document.getElementsByClassName(modKey)
          for (var i = 0; i < allClasses.length; ++i) {
          
          allClasses[i].style.fill = gradient(1 - data[key].value, GRADIENT);
          allClasses[i].childNodes[0].textContent = key + ' | Infected: ' + data[key].infected +
          ' | Deaths: ' + data[key].dead;
          allClasses[i].title = key + ' | Infected: ' + data[key].infected + ' | Deaths: ' + data[key].dead;
          $(allClasses[i]).attr('data-original-title', key + ' | Infected: ' + data[key].infected +
          ' | Deaths: ' + data[key].dead);
          
          }
          } catch (err) {
          var a = 1;
          }
          }
          }
          }
          
          var initLoadTooltip = false;
          
          window.onload = function () {
          var districtData = {};
          $.when(
          $.ajax("https://v1.api.covindia.com/district-values").then(response => {
          districtData = response;
          renderData(districtData);
          $('.clickable').tooltip();
          
          $('.clickable').tooltip({
          open: function (e, o) {
          $(o.tooltip).mouseover(function (e) {
          $('.clickable').tooltip('close');
          });
          $(o.tooltip).mouseout(function (e) { });
          },
          close: function (e, o) { },
          show: {
          duration: 800
          }
          });
          
          try {
          $(".Delhi").attr('data-original-title', 'Delhi' + ' | Infected: ' + districtData['Delhi']
          .infected + ' | Deaths: ' + districtData['Delhi'].dead);
          } catch {
          var a = 1;
          }
          try {
          $(".Mumbai").attr('data-original-title', 'Mumbai' + ' | Infected: ' + districtData[
          'Mumbai'].infected + ' | Deaths: ' + districtData['Mumbai'].dead);
          } catch {
          var a = 1;
          }
          $('#Mumbai-Unique').tooltip().mouseover();
          $('#Ladakh').tooltip().mouseover();
          $('#Kasargod').tooltip().mouseover();
          $('#Delhi-Unique').tooltip().mouseover();
          })
          );
          };
          
          $("#map").on("tap", function () {
          if (initLoadTooltip == false) {
          $('#Mumbai-Unique').tooltip().mouseout();
          $('#Delhi-Unique').tooltip().mouseout();
          $('#Ladakh').tooltip().mouseout();
          $('#Kasargod').tooltip().mouseout();
          
          initLoadTooltip = true;
          }
          });
          
          $("#map").on("click", function () {
          if (initLoadTooltip == false) {
          $('#Mumbai-Unique').tooltip().mouseout();
          $('#Delhi-Unique').tooltip().mouseout();
          $('#Ladakh').tooltip().mouseout();
          $('#Kasargod').tooltip().mouseout();
          initLoadTooltip = true;
          }
          });
          
          $.when(
          $.ajax("https://v1.api.covindia.com/latest-updates").then(response => {
          for (i in response) {
          $("#latest-updates")[0].innerHTML += response[i];
          
          }
          })
          );
          $.when(
          $.ajax("https://v1.api.covindia.com/general").then(response => {
          let rawDate = response.lastUpdatedTime
          let parsedString = rawDate.split(" ")
          let dateString = parsedString[0]
          dateString = dateString.split("-").reverse().join("/")
          let timeString = parsedString[1].split(":")
          timeString.pop()
          timeString = timeString.join(":")
          console.log(timeString)
          console.log(dateString)
          let finalStr = dateString + " " + timeString
          console.log(finalStr)
          var finalDate = new Date(finalStr)
          console.log(finalDate)
          finalStr = finalStr.split(" ").reverse().join(", ")
          $("#last-updated")[0].innerText = "Last updated: " + finalStr
          $("#cured")[0].innerText = response.totalCured;
          $("#deaths")[0].innerText = response.deathTotal;
          $("#infected")[0].innerText = response.infectedTotal;
          $("#max-infected")[0].innerText = response.infectedMax;
          $("#cured-desk")[0].innerText = `0${response.totalCured}`;
          $("#deaths-desk")[0].innerText = `0${response.deathTotal}`;
          $("#infected-desk")[0].innerText = response.infectedTotal;
          // $("#max-infected-desk")[0].innerText = response.infectedMax;
          var strDate = response.lastUpdatedTime;
          //console.log(response.lastUpdatedTime)
          var objDate = new Date(strDate);
          // TODO: add div with latest updates and parse time
          })
          );
          $.when(
          $.ajax("https://v1.api.covindia.com/daily-dates").then(response => {
          let tempArray = []
          for (let [key, value] of Object.entries(response)) {
          tempArray.push([key, value])
          }
          console.log(tempArray[tempArray.length - 2][1])
          $("#additions")[0].innerText = "+" + tempArray[tempArray.length - 1][1]
          }
          ))