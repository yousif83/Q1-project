var keys = [{
  id: "lifeQuality",
  header: "life quality"
}, {
  id: "lifeQualityScore",
  header: "life quality score"
}, {
  id: "livingCost",
  header: "cost of living"
} , {
  id: "climate",
  header: "climate"
}  ,
   {
     id: "population",
     header: "population"
},
   {
     id: "economy",
     header: "economy"
},
   {
     id: "healthcare",
     header: "healthcare"
},
   {
     id: "safety",
     header: "safety"
}]


var mainImage=document.getElementById('cityImg')
mainImage.src= "https://static.pexels.com/photos/30360/pexels-photo-30360.jpg"




var housingCostsSelect = document.querySelector("#housingCosts select")
var housingValue = document.getElementById('value')
var cities = []
var searchArr = []
var ButtonElement = document.getElementById('searchBtn')
var searchInput = document.getElementById('searchTxt')
var uaId
var searchCity
ButtonElement.addEventListener("click", function() {
  $("#caption").hide()
  $(".info").hide()
  $(".sugests").remove();
  $("#climate").empty();
  $("#population").empty();
  $("#economy").empty();
  $("#healthcare").empty();
  $("#safety").empty();
  // console.log($(".housingList option").value())
  $('#housingList').find('option').remove()

  var infoDivs = document.getElementsByClassName('info')

  for (var i = 0; i < keys.length; i++) {

    if (searchInput.value.toLowerCase().includes(keys[i].header.toLowerCase())) {

      infoDivs[i].style.display = "block"

    }
  }

  for (var i = 0; i < cities.length; i++) {
    if (searchInput.value.toLowerCase() == cities[i].toLowerCase()) {
      $(".info").show()
    }

    if (searchInput.value.toLowerCase().includes(cities[i].toLowerCase())  ) {

      searchCity = cities[i]
      searchCity = searchCity.split(' ').join('-');

    }
  }


  $.ajax({
      method: "GET",
      url: "https://api.teleport.org/api/urban_areas/slug:" + searchCity.toLowerCase() + "/images/",
    })
    .done(function(msg) {


      var image = document.getElementById('cityImg')
      image.src = msg.photos[0].image.web

    })

  $.ajax({
      method: "GET",
      url: "https://api.teleport.org/api/urban_areas/slug:" + searchCity.toLowerCase() + "/scores/",
    })
    .done(function(msg) {

      var h3LifeQuality = document.querySelector("#lifeQuality h3")
      var pLifeQuality = document.querySelector("#lifeQuality p")
      h3LifeQuality.innerHTML = "QUALITY OF LIFE IN " + searchCity.toUpperCase()
      pLifeQuality.innerHTML = msg.summary


      var labels = []
      var label = 'score_out_of_10'
      var data = []
      var backgroundColor = []
      for (var i = 0; i < msg.categories.length; i++) {
        labels[i] = msg.categories[i].name
        data[i] = msg.categories[i].score_out_of_10
        backgroundColor[i] = msg.categories[i].color

      }

      $("canvas").remove()

      document.getElementById('lifeQualityScore').appendChild(document.createElement("canvas"))
      var ctx = document.getElementsByTagName('canvas')
      var qualityChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: labels,
          datasets: [{
            label: label,
            data: data,
            backgroundColor: backgroundColor,

            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });

    })

  $.ajax({
      method: "GET",
      url: "https://api.teleport.org/api/urban_areas/slug:" + searchCity.toLowerCase() + "/",
    })
    .done(function(msg) {
      //  console.log(msg)
      uaId = msg.ua_id

      $.ajax({
          method: "GET",
          url: "https://api.teleport.org/api/urban_areas/teleport%3A" + uaId + "/details/",
        })
        .done(function(msg) {
          var dailyTitleTag = document.querySelectorAll("#dailyCostsDetails p")
          var index1 = [5, 4, 2, 7, 8]
          for (var i = 0; i < index1.length; i++) {
            var dailyValueSpan = document.createElement("span")
            dailyTitleTag[i].innerHTML = msg.categories[3].data[index1[i]].label.toUpperCase()
            dailyValueSpan.innerHTML = "$" + msg.categories[3].data[index1[i]].currency_dollar_value
            dailyValueSpan.style.fontWeight = "bold"
            dailyTitleTag[i].appendChild(dailyValueSpan)
          }
          for (var i = 0; i < 3; i++) {
            var opt = document.createElement('option');
            opt.value = msg.categories[8].data[i].currency_dollar_value;
            opt.innerHTML = innerHTML = msg.categories[8].data[i].label.toUpperCase();
            housingCostsSelect.appendChild(opt);
          }
          housingValue.innerHTML = "$" + housingCostsSelect.options[housingCostsSelect.selectedIndex].value;

          var url = "download.svg"
          var desc = msg.categories[2].data[msg.categories[2].data.length - 1].string_value
          buildDefaultTopic([0, 1, 2, 3], "climate", 2, desc, url)
          buildDefaultTopic([0, 1, 2], "population", 1, " ", " ")
          buildDefaultTopic([0, 2, 4], "economy", 5, " ", " ")
          buildDefaultTopic([0, 1, 3], "healthcare", 7, " ", " ")
          buildDefaultTopic([0, 2, 3, 4], "safety", 16, " ", " ")


          function buildDefaultTopic(index, topicName, categoryIndex, desc, url) {
            var keyValue
            var Div = document.getElementById(topicName)
            var H3 = document.createElement("h3")
            H3.innerHTML = topicName.toUpperCase()
            var P = document.createElement("p")
            P.innerHTML = desc
            Div.appendChild(H3)
            Div.appendChild(P)
            for (var i = 0; i < index.length; i++) {
              keyValue = msg.categories[categoryIndex].data[index[i]].type + "_value"
              var InsideDiv = document.createElement("div")
              InsideDiv.classList.add("col-xs-12")
              InsideDiv.classList.add("col-md-6")
              var InsideP = document.createElement("p")
              InsideP.innerHTML = msg.categories[categoryIndex].data[index[i]].label.toUpperCase();
              var icon = document.createElement("img")
              if (msg.categories[categoryIndex].data[index[i]].id=="WEATHER-AV-DAY-LENGTH" ||
                  msg.categories[categoryIndex].data[index[i]].id=="WEATHER-AV-NUMBER-CLEAR-DAYS" ||
                  msg.categories[categoryIndex].data[index[i]].id=="WEATHER-AV-POSSIBILITY-SUNSHINE" ||
                  msg.categories[categoryIndex].data[index[i]].id=="WEATHER-AVERAGE-HIGH" ||
                  msg.categories[categoryIndex].data[index[i]].id=="WEATHER-SUNSHINE-AMOUNT") {
                  icon.src = url
              }

              var Value = document.createElement("p")
              if (keyValue == "percent_value") {
                Value.innerHTML = 100 * msg.categories[categoryIndex].data[index[i]][keyValue] + "%";
              } else if (keyValue == "currency_dollar_value") {
                Value.innerHTML = "$" + msg.categories[categoryIndex].data[index[i]][keyValue];
              } else {
                Value.innerHTML = msg.categories[categoryIndex].data[index[i]][keyValue];
              }
              Value.classList.add(topicName + "Value")
              InsideDiv.appendChild(InsideP)
              InsideDiv.appendChild(icon)
              InsideDiv.appendChild(Value)
              Div.appendChild(InsideDiv)
              InsideDiv.style.fontWeight = "bold"
            }
          }
        })

      $.ajax({
          method: "GET",
          url: "https://api.teleport.org/api/urban_areas/teleport%3A" + uaId + "/salaries/",
        })
        .done(function(msg) {

        })
    })
});

housingCostsSelect.addEventListener("change", function() {
  housingValue.innerHTML = housingCostsSelect.options[housingCostsSelect.selectedIndex].value;
});
searchInput.addEventListener('input', function(evt) {
  var t = this.value
  $(".sugests").remove();
  $.ajax({
      method: "GET",
      url: " https://api.teleport.org/api/urban_areas/",
    })
    .done(function(msg) {
      var x = 0
      var j = 0
      var begin = 0
      for (var i = 0; i < msg._links["ua:item"].length; i++) {
        if (msg._links["ua:item"][i].name=="Lima") {
          cities[i]="_"
        }
        else {
            cities[i] = msg._links["ua:item"][i].name
        }

        x = similar_text(msg._links["ua:item"][i].name.toLowerCase(), t, 60);
        if (x >= 60) {
          j = j + 1
          var sugestions = document.createElement("input")
          sugestions.setAttribute("id", "input" + j);
          sugestions.value = cities[i]
          sugestions.style.position = "absolute"
          sugestions.style.display = "block"
          sugestions.style.top = 50 + j * 50 + "%"
          sugestions.classList.add("sugests")
          sugestions.classList.add("navbar-left")

          document.getElementsByClassName('searchForm')[0].appendChild(sugestions)
        }
      }
      $(".sugests").click(function() {
        searchInput.value = this.value
        $(".sugests").remove();
      });
    })


});






function similar_text(first, second, percent) { // eslint-disable-line camelcase
  if (first === null ||
    second === null ||
    typeof first === 'undefined' ||
    typeof second === 'undefined') {
    return 0
  }
  first += ''
  second += ''
  var pos1 = 0
  var pos2 = 0
  var max = 0
  var firstLength = first.length
  var secondLength = second.length
  var p
  var q
  var l
  var sum
  for (p = 0; p < firstLength; p++) {
    for (q = 0; q < secondLength; q++) {
      for (l = 0;
        (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++) { // eslint-disable-line max-len

      }
      if (l > max) {
        max = l
        pos1 = p
        pos2 = q
      }
    }
  }
  sum = max
  if (sum) {
    if (pos1 && pos2) {
      sum += similar_text(first.substr(0, pos1), second.substr(0, pos2))
    }
    if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
      sum += similar_text(
        first.substr(pos1 + max, firstLength - pos1 - max),
        second.substr(pos2 + max,
          secondLength - pos2 - max))
    }
  }
  if (!percent) {
    return sum
  }
  return (sum * 200) / (firstLength + secondLength)
}
