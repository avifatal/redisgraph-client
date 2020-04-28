const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
const RedisGraph = require("redisgraph.js").Graph;


let graph = new RedisGraph("redisgraph", "redisgraph", 6379);

const runQuery = async (graph, q) => {

  for (var i of q.split("\n")) {
    var query = i.trim();

    if (query && !query.startsWith("#") && !query.startsWith("//")) {
      console.log("-------" + i.trim() + "-------");
      await graph.query(i.trim());
    }
  }
}

app.get('/run', function (req, res) {
  
});

app.get('/test', async (req, res) => {
  
  await graph.query(`MATCH (a:human) DELETE a`);
  await graph.query(`MATCH (a:owner_of) DELETE a`);
  await graph.query(`MATCH (a:friend_of) DELETE a`);
  await graph.query(`MATCH (a:account) DELETE a`);

  var query = `
    CREATE (:human{name:'human_{num}'})
    
    CREATE (:account{name:'twitter_{num}'})
    CREATE (:account{name:'linkedin_{num}'})
    CREATE (:account{name:'instagram_{num}'})
    

    CREATE (:account{name:'insta_random_{num}_1'})
    CREATE (:account{name:'insta_random_{num}_2'})
    CREATE (:account{name:'insta_random_{num}_3'})
    CREATE (:account{name:'insta_random_{num}_4'})
    
    CREATE (:account{name:'twitter_random_{num}_1'})
    CREATE (:account{name:'twitter_random_{num}_2'})
    CREATE (:account{name:'twitter_random_{num}_3'})
    CREATE (:account{name:'twitter_random_{num}_4'})
    
    CREATE (:account{name:'linkedin_random_{num}_1'})
    CREATE (:account{name:'linkedin_random_{num}_2'})
    CREATE (:account{name:'linkedin_random_{num}_3'})
    CREATE (:account{name:'linkedin_random_{num}_4'})

    MATCH (a:account), (b:account) WHERE (a.name = 'insta_random_{num}_1' AND b.name='instagram_{num}') CREATE (a)-[:ttt]->(b)

    MATCH (h:human), (a:account) WHERE (h.name = 'human_{num}' AND a.name='twitter_{num}') CREATE (h)-[:owner_of]->(a)
    MATCH (h:human), (a:account) WHERE (h.name = 'human_{num}' AND a.name='linkedin_{num}') CREATE (h)-[:owner_of]->(a)
    MATCH (h:human), (a:account) WHERE (h.name = 'human_{num}' AND a.name='instagram_{num}') CREATE (h)-[:owner_of]->(a)`;

  await runQuery(graph, query.replace(/{num}/g,1));
  await runQuery(graph, query.replace(/{num}/g,2));
  await runQuery(graph, query.replace(/{num}/g,3));
  await runQuery(graph, query.replace(/{num}/g,4));
  

  
  var connections = `
    MATCH (a:account), (b:account) WHERE (a.name = 'twitter_2' AND b.name='twitter_1') CREATE (a)-[:friend_of]->(b)
    MATCH (a:account), (b:account) WHERE (a.name = 'instagram_2' AND b.name='instagram_3') CREATE (a)-[:friend_of]->(b)
  `;
  
  await runQuery(graph,connections);


  let result = null;
  try {
    result = await graph.query("MATCH ()-[e]->() RETURN e");
    //result = await graph.query("MATCH (a:account)-[o:friend_of]->(b:account) RETURN a,b,o");
    //result = await graph.query("MATCH (h:human)-[o:owner_of]->(aa:account) RETURN h,o,aa");
    //result = await graph.query("MATCH (h:human)-[o:owner_of]->(aa:account)-[f:friend_of]->(ab:account) RETURN h,ab");
  }
  catch (e) {
    console.log(e);
  }
  let arr = [];
  while (result.hasNext()) {
    arr.push(result.next());
  }
  res.send(arr);
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);