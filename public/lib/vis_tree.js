define(function (require) {

    // one Factory is created and used, even on second module load attempt
    return function visFactory() {
        
        // singleton visualisations of each type can be created (mini dashboards could be created)
        // if only one type can be instatiated, allow for only one vis handle to be stored and assigned
        var visTree;
        var d3 = require("d3v4");
        
        this.createVis = function(type, init) {
            
            if (type === "tree") {
                // singleton tree visualisation is created
                //if (tree === undefined) visTree = new treebsar(init);
                visTree = new tree(init);
                return visTree;
            }
            else
                return undefined;
        };
        
        function level(usuario, children) {
          this.name = usuario;
          if (children !== undefined)
            this.children = children.map(function(e){
              return new children_item(String(e.key));
            });
          else 
            this.children = [];
        }
        function children_item(item) {
          this.name = item;
        }
        /*
         * tree;
         */
        var tree = function (init) {
            //Width and height
            var w = 500;
            var h = 100;
            var barPadding = 1;
            var svgRoot = init;
            var svg;
            
            var dataset = null;/*[5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                            11, 12, 15, 20, 18, 17, 16, 18, 23, 25];*/    
            // functions
            this.updateData = function(data) {
                if (data !== null) {
                   this.dataset = data;
                };
            };

            this.getW = function(){
                return w;
            };

            this.transformData = function(){
              var datos = this.dataset;

              var total = [];

              datos.forEach(function(item){
                total.push(new level(item.id,item.group));
              });

              var otra =
                {
                  "name": "play game",
                  "children": total
                };
                
              this.dataset = otra;

            }
            
            this.render = function (vis) {
                
                //Realizamos el tratamiento de datos.
                this.dataset.sort(function(a,b){
                  return (a.group - b.group);
                });

                this.transformData();

                var treeData = this.dataset;

                $('#tree-container svg').remove();

                // Set the dimensions and margins of the diagram
                var margin = {top: 20, right: 90, bottom: 30, left: 90},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                // append the svg object to the body of the page
                // appends a 'group' element to 'svg'
                // moves the 'group' element to the top left margin
                var svg = d3.select("#tree-container").append("svg")
                    .attr("width", width + margin.right + margin.left)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate("
                          + margin.left + "," + margin.top + ")");

                var i = 0,
                    duration = 750,
                    root;

                // declares a tree layout and assigns the size
                var treemap = d3.tree().size([height, width]);

                // Assigns parent, children, height, depth
                root = d3.hierarchy(treeData, function(d) { return d.children; });
                root.x0 = height / 2;
                root.y0 = 0;

                // Collapse after the second level
                root.children.forEach(collapse);

                update(root);

                // Collapse the node and all it's children
                function collapse(d) {
                  if(d.children) {
                    d._children = d.children
                    d._children.forEach(collapse)
                    d.children = null
                  }
                }

                function update(source) {

                  // Assigns the x and y position for the nodes
                  var treeData = treemap(root);

                  // Compute the new tree layout.
                  var nodes = treeData.descendants(),
                      links = treeData.descendants().slice(1);

                  // Normalize for fixed-depth.
                  nodes.forEach(function(d){ d.y = d.depth * 180});

                  // ****************** Nodes section ***************************

                  // Update the nodes...
                  var node = svg.selectAll('g.node')
                      .data(nodes, function(d) {return d.id || (d.id = ++i); });

                  // Enter any new modes at the parent's previous position.
                  var nodeEnter = node.enter().append('g')
                      .attr('class', 'node')
                      .attr("transform", function(d) {
                        return "translate(" + source.y0 + "," + source.x0 + ")";
                    })
                    .on('click', click);

                  // Add Circle for the nodes
                  nodeEnter.append('circle')
                      .attr('class', 'node')
                      .attr('r', 1e-6)
                      .style("fill", function(d) {
                          return d._children ? "lightsteelblue" : "#fff";
                      });

                  // Add labels for the nodes
                  nodeEnter.append('text')
                      .attr("dy", ".35em")
                      .attr("x", function(d) {
                          return d.children || d._children ? -13 : 13;
                      })
                      .attr("text-anchor", function(d) {
                          return d.children || d._children ? "end" : "start";
                      })
                      .text(function(d) { return d.data.name; });

                  // UPDATE
                  var nodeUpdate = nodeEnter.merge(node);

                  // Transition to the proper position for the node
                  nodeUpdate.transition()
                    .duration(duration)
                    .attr("transform", function(d) { 
                        return "translate(" + d.y + "," + d.x + ")";
                     });

                  // Update the node attributes and style
                  nodeUpdate.select('circle.node')
                    .attr('r', 10)
                    .style("fill", function(d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    })
                    .attr('cursor', 'pointer');


                  // Remove any exiting nodes
                  var nodeExit = node.exit().transition()
                      .duration(duration)
                      .attr("transform", function(d) {
                          return "translate(" + source.y + "," + source.x + ")";
                      })
                      .remove();

                  // On exit reduce the node circles size to 0
                  nodeExit.select('circle')
                    .attr('r', 1e-6);

                  // On exit reduce the opacity of text labels
                  nodeExit.select('text')
                    .style('fill-opacity', 1e-6);

                  // ****************** links section ***************************

                  // Update the links...
                  var link = svg.selectAll('path.link')
                      .data(links, function(d) { return d.id; });

                  // Enter any new links at the parent's previous position.
                  var linkEnter = link.enter().insert('path', "g")
                      .attr("class", "link")
                      .attr('d', function(d){
                        var o = {x: source.x0, y: source.y0}
                        return diagonal(o, o)
                      });

                  // UPDATE
                  var linkUpdate = linkEnter.merge(link);

                  // Transition back to the parent element position
                  linkUpdate.transition()
                      .duration(duration)
                      .attr('d', function(d){ return diagonal(d, d.parent) });

                  // Remove any exiting links
                  var linkExit = link.exit().transition()
                      .duration(duration)
                      .attr('d', function(d) {
                        var o = {x: source.x, y: source.y}
                        return diagonal(o, o)
                      })
                      .remove();

                  // Store the old positions for transition.
                  nodes.forEach(function(d){
                    d.x0 = d.x;
                    d.y0 = d.y;
                  });

                  // Creates a curved (diagonal) path from parent to the child nodes
                  function diagonal(s, d) {

                    path = `M ${s.y} ${s.x}
                            C ${(s.y + d.y) / 2} ${s.x},
                              ${(s.y + d.y) / 2} ${d.x},
                              ${d.y} ${d.x}`

                    return path
                  }

                  // Toggle children on click.
                  function click(d) {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                      } else {
                        d.children = d._children;
                        d._children = null;
                      }
                    update(d);
                  }
                }
            };

            return this;
        }
    };
});