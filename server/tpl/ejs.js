module.exports = `
<!DOCYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>koa 学习</title>
    <link href="https://cdn.bootcss.com/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://cdn.bootcss.com/twitter-bootstrap/4.3.1/js/bootstrap.min.js"></script>
  </head>
  <body>
    <div class ="container" >
      <div class="row">
        <div class="col-md-8">
        <h1>Hi  <%=you%></h1>
        <p> This is ZHZ </p>
        </div>
        <div class="col-md-4">
        <h1>Hi  <%=me%> </h1>
        <p> 动态 ejs模板引擎 </p>
        </div>
        </div>
     </div>
  </body>
</html>
`