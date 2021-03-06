import * as d3 from 'd3';
import {
  filterData
} from './filterData';

import {
  formatData
} from './formatData';

import {
  hasMigrationBg
} from './filterData';

// console.log(d3)

const margin = {
  top: 10,
  right: 5,
  bottom: 10,
  left: 5
};

var width = 1100 - margin.left - margin.right;

var height = 900 - margin.top - margin.bottom;

const url = 'https://gist.githubusercontent.com/TomasS666/d025078bea79fa178ee14b1913658ebd/raw/29ee53cf993bc82a481a65fd3df7075b75417f2a/gistfile1.csv';

// const data = fetch('https://gist.githubusercontent.com/TomasS666/d025078bea79fa178ee14b1913658ebd/raw/3c219e0bde4f5b1655e42ab73b9091bd5af11233/gistfile1.csv',{
// headers : { 
//   'Content-Type': 'application/json',
//   'Accept': 'application/json'
//  }

// });


const data = d3.csv(url)
  .then(data => filterData(data))
  .then(data => initDrawing(data))

function initDrawing(data) {

  const migrationBackground = hasMigrationBg(data);
  const nestedMigrationBg = d3.nest()
    .key(d => d.migratieachtergrond)
    .entries(migrationBackground);

  const nestedRightfulness = formatData(data);

  const migrationKeys = nestedMigrationBg.map(d => d.key).sort()
  // console.log(nestedMigrationBg)
  const colorscale = d3.scaleOrdinal()
    // .domain(migrationKeys)
    .range(['#F79824', 'blue']);

  console.log(migrationKeys, 'hello')

  nestedRightfulness.forEach(e => {
    e.length = e.values.length;
  })

  const priority_order = ['Zeer terecht', 'Terecht', 'Niet terecht, niet onterecht', 'Onterecht', 'Zeer onterecht']
  const doubleNest = d3.nest()
    .key(d => d.stel_terecht)
    .sortKeys(function (a, b) {
      // console.log(priority_order[(priority_order.indexOf(a) - priority_order.indexOf(b))])
      return priority_order.indexOf(a) - priority_order.indexOf(b);
    })
    .key(d => d.migratieachtergrond)
    .entries(migrationBackground);



  // doubleNest.forEach((e) => {
  //     e.values.forEach((e, i) => {

  //         e.values.forEach((d, i) => {
  //             // console.log(i)
  //             d.plek = i;
  //             d.parentLength = e.values.length;
  //             // e.values.forEach((e, i)=>{

  //             // })

  //         })
  //     })
  // })


  // console.log(doubleNest)

  // console.log(doubleNest)
  // const defData = updateData(data)
  const populationNumber = d3.select('#population-number');

  
  populationNumber
  .select("#geheel")
    .html(data.length);


  function updateData(data) {

   

    populationNumber
      .select("#deel")
        .html(data.length);

      
      

    const test = d3.nest()
      .key(d => d.migratieachtergrond).entries(data);

   

    // data.forEach(e => e.parentLength = elem.values.length)
    test.forEach(elem => elem.values.forEach(e => e.parentLength = elem.values.length))
    // console.log(test.values)
 
    const mig = d3.nest()
      .key(d => d.stel_terecht)
      .sortKeys(function (a, b) {
        // console.log(priority_order[(priority_order.indexOf(a) - priority_order.indexOf(b))])
        return priority_order.indexOf(a) - priority_order.indexOf(b);
      })
      .rollup(v => {
        return Math.ceil((100 / v[0].parentLength) * v.length)
      })
      .entries(test[0].values);
    // console.log(newTest.values[0], 'wef')


    const geen_mig = d3.nest()
      .key(d => d.stel_terecht)
      .sortKeys(function (a, b) {
        // console.log(priority_order[(priority_order.indexOf(a) - priority_order.indexOf(b))])
        return priority_order.indexOf(a) - priority_order.indexOf(b);
      })
      .rollup(v => {
        // console.log(v)

        return Math.round((100 / v[0].parentLength) * v.length);

      })
      .entries(test[1].values);



    // console.log(mig ,'fwef')

    const objectMig = mig.map(obj => {
      return {
        migratieachtergrond: "ja",
        terechtheid: obj.key,
        percentage: obj.value
      }
    })

    const objectNoMig = geen_mig.map(obj => {
      return {
        migratieachtergrond: "nee",
        terechtheid: obj.key,
        percentage: obj.value
      }
    })

    
    const percentageData = [...objectMig, ...objectNoMig];
    updatePopulation(percentageData)

    // console.log([...objectMig, ...objectNoMig])



    const actualData = [{
      key: 'migratieachtergrond',
      waarden: mig.map(terechtheid => {
        // let title = terechtheid.key;

        // return terechtheid.key;
        return {

          key: terechtheid.key,
          waarden: [...Array(terechtheid.value).keys()].map(e => {
            return {
              plek: e,
              terechtheid: terechtheid.key,
              migratieachtergrond: 'Deelnemer met migratieachtergrond'
            }
          })


        }
      })
    }, {
      key: 'geen_mig',
      waarden: geen_mig.map(terechtheid => {
        // let title = terechtheid.key;

        // return terechtheid.key;
        return {

          key: terechtheid.key,
          waarden: [...Array(terechtheid.value).keys()].map(e => {
            return {
              plek: e,
              terechtheid: terechtheid.key,
              migratieachtergrond: 'Deelnemer zonder migratieachtergrond'
            }
          })
        }
      })
    }];





    // console.log(actualData, 'wef')

    const defData = [...actualData[0].waarden, ...actualData[1].waarden].map(e => e.waarden).flat(2)

    console.log(defData, 'voor Fred')
    // console.log(temp.flat(2), 'yes')

    // const defData = [...temp[0], ...temp[1], ...temp[2], ...temp[3], ...temp[4], ...temp[5], ...temp[6], ...temp[7], ...temp[8], ...temp[9]];

    const testing = defData.map(function (d) {
      // const keyLength = nestedRightfulness
      //     .filter(e => e.key == d.stel_terecht)
      //     .reduce(e => e).values.length;
      // console.log(y(d.terechtheid))
      // console.log((height / doubleNest.length) / 2)
      return d.idealy = (y(d.terechtheid) + ((height / doubleNest.length) / 2));
    });

    console.log(testing)

    const simulation = d3.forceSimulation(defData)


      .force("x", d3.forceX(function (d, i) {
        return d.x;
      }))
      .force("y", d3.forceY(function (d) {
        // console.log( y(10000))
        return d.idealy;
      }))


    // From https://bl.ocks.org/chloerulesok/e45c8bb1241c4f6051ef30623e6fe552
    // Author: chloerulesok’s
    for (let i = 0; i < 120; ++i) simulation.tick();


    console.log(defData, 'halle')
    update(defData)
    // return defData;

  }

  // console.log(newTest, 'fwef')



  // const dropdown = d3.select('select');
  // dropdown
  //     .style('display', 'block')

  // dropdown.selectAll('option')
  //     .data(nestedMigrationBg)
  //     .enter()
  //     .append('option')
  //     .attr('value', d => d.key)
  //     .html(d => d.key)

  const margin = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 60
  };

  const y = d3.scaleBand().rangeRound([0, height]);

  // From https://bl.ocks.org/chloerulesok/e45c8bb1241c4f6051ef30623e6fe552
  // Author: chloerulesok’s
  y.domain(d3.map(doubleNest, function (d) {
    return d.key;

  }).keys());

  // List population

  // const population = d3.select("#population")
  // const divs = population.selectAll("div");
  // divs.data(doubleNest)
  // .enter().append('div')
  //   .select('h3')
  //     .data(nestedRightfulness)
  //     .enter().append('h3')
  //     .text(d => {
  //       return `${ d.key } ${Math.round((100 /data.length) * d.length)}%`;
  //     });

  // console.log(doubleNest)

  // const population = d3.select("#population");

  // const selection = population.selectAll("div")
  //   .data(doubleNest)
  //   .enter().append("div");

  // selection.append("h3")
  //   // .data(nestedRightfulness)
  //   // .enter().append("h3")
  //   .text(d => {
  //     return `${ d.key } ${Math.round((100 /data.length) * d.length)}%`;
  //   });
  // selection.append("p")
  //   .text(d => {
  //     // console.log(d.values[0].values.length)
  //     // return `Nederlandse Nederlanders ${Math.round((100 / d.values[0].values.length) * d.length)}%`;
  //     return `Nederlandse Nederlanders ${d.values[0].values.length}`;
  //   });
  // selection.append("p")

  //   .text(d => {
  //     return `Nederlanders met een migratieachtergrond ${d.values[1].values.length}`;
  //   });


  // .select('p')
  //   .data(nestedRightfulness)
  //   .enter().append('h3')
  //   .text(d => {
  //     return `${ d.key } ${Math.round((100 /data.length) * d.length)}%`;
  //   })
  // .select('h3')
  // .data(nestedRightfulness)
  // .text(d => {
  //   return `${ d.key } ${d.length}`;
  // })

  // d3.select('h3#zeer-terecht')
  //   .data(nestedRightfulness)
  //   .text(d => {
  //     return `${ d.key } ${d.length}`;
  //   })

  //  var xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);


  // Bron voor tickSize truc :https://medium.com/@ghenshaw.work/customizing-axes-in-d3-js-99d58863738b
  yAxis.tickSize(-1300);



  // console.log(nestedRightfulness.filter(e => e.key =()= 'Terecht')[0].values.length)
  // console.log(y("Terecht"), 'gvd')


  const xPosition = doubleNest.map(group => {
    return group.values.map((obj, i) => {
      return obj.x = i + 120;
    })
  });

  // console.log(xPosition)


  // console.log(testing)



  console.log(data)

  const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 1800 1000`);
  svg.append("g");




  var scatter = svg.append("g");
  scatter.attr("id", "scatterplot");

  // From https://bl.ocks.org/chloerulesok/e45c8bb1241c4f6051ef30623e6fe552
  // Author: chloerulesok’s
  // var clip = svg.append("defs").append("svg:clipPath")
  //     .attr("id", "clip")
  //     .append("svg:rect")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .attr("x", 0)
  //     .attr("y", 0);



  // const test = d3.map(nestedMigrationBg, function (d) {

  //     return d.key;
  // })

  // console.log(test)



  // From https://bl.ocks.org/chloerulesok/e45c8bb1241c4f6051ef30623e6fe552
  // Author: chloerulesok’s
  // y axis
  svg.append("g")
    .attr("class", "y axis")
    .attr('id', "axis--y")
    .call(yAxis);

  // From https://bl.ocks.org/chloerulesok/e45c8bb1241c4f6051ef30623e6fe552
  // Author: chloerulesok’s

  // .force("collide", d3.forceCollide(1)
  //     .strength(0)f
  //     .iterations(2))
  // .stop();


  updateData(data);



  // const array = [...Array(200).keys()];

  let currentlyActive = null;
  let counter = 1;


  function update(circledata) {



    const consequenceMenu = d3.select('nav[data-filter="gevolg-contact"]');

    consequenceMenu
      .on("click", function () {

        if (counter % 2 == 0) {
          console.log('disabled')

        } else {
          console.log('enabled')
          counter = 1
        }


        currentlyActive = [event.target.dataset];

        event.target.classList.add("active")
        // .classed('active', true)
        const filterConsequence = data.filter(d => {
          return d[event.target.dataset.value] != "99999" && d[event.target.dataset.value] != "0";
        })
        // console.log(filterConsequence)
        updateData(filterConsequence)
      });


    // console.log(data)
    console.log('update')


    // var scatter = svg.append("g");
    // scatter.attr("id", "scatterplot");
    // // scatter.append("rect")
    // //   .attr('x', 0)
    // //   .attr('y', 0)
    // //   .attr('width', '100%')
    // //   .attr('height', '100%');


    // const circles = scatter.selectAll(".dot");

    // circles.data(circledata)
    //   .attr('id', d => {
    //     console.log('update pattern')
    //     return d.migratieachtergrond
    //   })
    //   .attr("class", "dot")
    //   .attr("r", 300)

    //   .attr("cx", function (d, i) {

    //     // return i == 0 ? 20 : i * 20
    //     // console.log(d, 'fwef')
    //     return d.plek == 0 ? 10 : d.plek * 10

    //   })
    //   // .transition().duration(2000)

    //   .attr("cy", function (d, i, j) {

    //     // if(d.parentLength > 10){
    //     //     return d.y + (d.migratieachtergrond == 'Deelnemers met migratieachtergrond' ? 15 : 0)
    //     // }

    //     return d.y + (d.migratieachtergrond == 'ja' ? 5 : -5)

    //   })


    //   .style("fill", d => colorscale(d.migratieachtergrond));

    // circles.data(circledata)
    //   .enter().append("circle")
    //   .attr('id', d => d.migratieachtergrond)
    //   .attr("class", "dot")
    //   .attr("r", 3)

    //   .attr("cx", function (d, i) {
    //     console.log('enter pattern')
    //     // return i == 0 ? 20 : i * 20

    //     return d.plek == 0 ? 10 : d.plek * 10

    //   })
    //   // .transition().duration(2000)

    //   .attr("cy", function (d, i, j) {

    //     // if(d.parentLength > 10){
    //     //     return d.y + (d.migratieachtergrond == 'Deelnemers met migratieachtergrond' ? 15 : 0)
    //     // }

    //     return d.y + (d.migratieachtergrond == 'ja' ? 5 : -5)

    //   })


    //   .style("fill", d => colorscale(d.migratieachtergrond));


    // circles.data(circledata).exit().remove()


    // scatter.append("rect")
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('width', '100%')
    //   .attr('height', '100%');


    const circles = scatter.selectAll(".dot");



    circles.data(circledata)
      .attr('id', d => d.migratieachtergrond)
      .attr("class", "dot")
      .attr("r", 0)
      .transition().duration(2000)
      .attr("r", 5)


    circles

      .attr("cy", function (d, i, j) {

        // if(d.parentLength > 10){
        //     return d.y + (d.migratieachtergrond == 'Deelnemers met migratieachtergrond' ? 15 : 0)
        // }

        return d.y + (d.migratieachtergrond == 'Deelnemer zonder migratieachtergrond' ? 10 : -10)

      })

      .attr("cx", function (d, i) {
        console.log('update pattern')
        // return i == 0 ? 20 : i * 20

        return d.plek == 0 ? 15 : d.plek * 15

      })

      .style("fill", d => colorscale(d.migratieachtergrond))
      .attr("r", 0)
      .transition().duration(2000)
      .attr("r", 5);

    circles.data(circledata)
      .enter().append("circle")

      .attr('id', d => d.migratieachtergrond)
      .attr("class", "dot")

      .attr("cx", 0)



      .attr("cy", function (d, i, j) {

        // if(d.parentLength > 10){
        //     return d.y + (d.migratieachtergrond == 'Deelnemers met migratieachtergrond' ? 15 : 0)
        // }

        return d.y + (d.migratieachtergrond == 'Deelnemer zonder migratieachtergrond' ? 10 : -10)

      })


      .style("fill", d => colorscale(d.migratieachtergrond))

      // .attr("r", 0)
      // .transition().duration(2000)
      .attr("r", 5)
      .transition().delay((d, i) => i * 3).duration(2000)
      .attr("cx", function (d, i) {
        console.log('enter pattern')
        // return i == 0 ? 20 : i * 20

        return d.plek == 0 ? 15 : d.plek * 15

      });







    circles.data(circledata).exit().remove();






  }



  console.log(colorscale.domain(), 'wefwef')

  // const nestedConsequence = d3.nest()
  //   .key(d => d.polben_gevolg_controle)
  //   .entries(data);

  // console.log(nestedConsequence)

console.log(doubleNest, 'hmm')
  function updatePopulation(populationData){

    
    const percentages = d3.nest()
    .key(d => d.terechtheid)
    .rollup(v => {
      
      return d3.sum(v, function(d) { return d.percentage; })
    })
    .entries(populationData)
    // console.log(percentages, 'percentages??')
   

     const population = d3.select("#population");

  const containers = population.selectAll("div");

    containers.data(doubleNest)
    .enter().append("div");

console.log(d3.select("#population").selectAll("div"))

  const selection = d3.select("#population").selectAll("div > h3").data(percentages);

  selection
  .html(d => {
    // return `${ d.key } ${Math.round((100 /data.length) * d.length)}%`;
    return `${ d.key } : <span class="marker">${d.value / 2} %</span>  ` ;
  });

  
   selection.enter()
    .append("h3")
    // .data(nestedRightfulness)
    // .enter().append("h3")
    .html(d => {
      // return `${ d.key } ${Math.round((100 /data.length) * d.length)}%`;
      return `${ d.key } : <span class="marker">${d.value / 2} %</span>  ` ;
    });


    selection.exit().remove()



  // selection.append("p")
  //   .text(d => {
  //     return d.migratieachtergrond == 'nee' ? d.percentage : null;
  //     return `Nederlanders met een migratieachtergrond ${d.values[1].values.length}`;
  //   });
  }

  function selectData(category) {

    // Wrote this myself.
    const newArray = doubleNest.filter(item => {
      return item.key == category
    }).reduce(item => item)

    // console.log(newArray)
    update(newArray.values)

    return;

  }

  createLegend()

  function createLegend() {
    // Wrote this myself
    const legendWrapper = svg.append('g')
      .attr("class", "legend");


    legendWrapper
      .append("rect")
      .attr("x", 5)
      .attr("class", "legend-wrapper");
    // .on('click', console.log('f'));
    let clickCount = 0;
    const legendContainer = legendWrapper.append('g')
      .attr('class', 'legend-container')
      .attr('data-legend', 'container')
      .on('click', function () {

        // console.log(event.target)\

        /* Event delegation (a little ugly, yet better than multiple eventlisteners)
    
              Works pretty much the same way as a normal eventlistener (event), exept that the 
              event object is available already within the eventlistener.
    
              If the parent of all legend items it's data-legend value equals container,
              I know I'm in the right place. Itemparent is the legend item it's parent group which holds
              the text and the rect. That group contains the category and I can put an active class on it.
    
            */
        const upperParent = event.target.parentNode.parentNode.dataset.legend;


        if (upperParent === 'container') {
          const itemParent = event.target.parentNode;

          legendContainer.selectAll('.legend-item')
            .classed('active', false)
            .attr('class', 'legend-item');

          // if(clickCount % 2 === 0){
          //   console.log('fefefef')
          itemParent.classList.add('active');
          //   clickCount++;
          // }else{
          //   clickCount = 0;
          //   console.log('yeaa?')
          //   itemParent.classList.remove('active');  
          // }

          // Call function and give category name of the legend-item group as argument
          selectData(itemParent.dataset.category)
        }


      })

    const legend = legendContainer.selectAll(".legend")
      .data(colorscale.domain())
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr('data-category', d => {
        console.log(d)
        return d
      })
      .attr("transform", function (d, i) {
        return "translate(0," + i * 35 + ")";
      })
      .on('click', function () {
        // selectData(d3.event.target.parentNode.dataset.category)
        // console.log(d)
      });

    legend.append("circle")
      .attr("cx", 185 - 5)
      .attr("cy", 9)
      .attr("r", 10)
      .style("fill", colorscale);

    legend.append("text")
      .attr("x", 200)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("class", "legend-text")

      .text(function (d) {
        return d;
      })

    legendWrapper
      .style("transform", `translate(0px, ${height + 5}px)`);

  }

}


const mobileButtons = d3.select('nav[data-filter="gevolg-contact-mobile"]');
const img = document.querySelector("#mobile-vis-img");

mobileButtons.on("click", d =>{
  console.log(img)
  img.src = `images/${event.target.dataset.value }.png`;
})

