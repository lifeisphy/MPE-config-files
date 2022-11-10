const { throws } = require("assert");
const { error } = require("console");
const { emitWarning } = require("process");
const { stringify } = require("querystring");

var fs = require("fs");
var docjson_global;
module.exports = {
  //文本替换放在Will，要替换成html文本的放到Did
  onWillParseMarkdown: function(markdown) {
    return new Promise((resolve, reject)=> {
      return resolve(markdown);
    })
  },
  onDidParseMarkdown: function(html, {cheerio}) { //<div class="mume markdown-preview"></div>的全部内容
    return new Promise((resolve, reject)=> {
      html= on_did_parse_main(html);
      return resolve(html);
    })
  },
  onWillTransformMarkdown: function (markdown) {
        return new Promise((resolve, reject) => {
          markdown = on_will_parse_main(markdown);
          return resolve(markdown);
        });
    },
  
  onDidTransformMarkdown: function (markdown) {
      return new Promise((resolve, reject) => {

        return resolve(markdown);
      });
  }
};
function katex_macro_replace(markdown){
  /**
   * 如果是不必要的，但加入知乎公式的自动调整之后，使用的katex宏就不能正常导出了，
   * 需要根据katex_config.js进行宏替换才能正常使用公式
   */
  var katex_macros = require("./katex_config").macros;
  f = new FileWriter(`D:/PKU/notes/QCQI/test.txt`);
  for (var key in katex_macros){
    val = katex_macros[key]
    re = new RegExp(`(\\${key})(?=[^\\w])`,'gm');
    
    function replacement(whole,value){
      // f.append(`${whole}:${value}\n`);
      return val;
    }
    markdown = markdown.replace(re,replacement);
    // re = /\\a(?=[^\w])/gm;
  }
  return markdown;
}
function do_css_import(markdown,mode){
  // 根据全局模式导入使用的css样式表，主要针对passage和ppt两种模式。
  // __dirname is the directory of your parser.js file, sth like: "~/.mume"
  if(mode == "passage"){
    markdown = `\n\n@import "${__dirname}/passage.less";\n\n`+markdown;
  } else if (mode=="powerpoint"){
    markdown = `\n\n@import "${__dirname}/ppt.less";\n\n`+markdown;
  }
  return markdown;
};
function do_markdown_import(markdown){
  // TODO
  // why use this? The PPT mode cannot work well with built-in @import.
  // reg = /\\([\w]*?)((\[[^\[\]]*?\])+?){(([^{}]|(\${1,2}[^\$]+?\${1,2}))+?)}/gm
  // reg = 
  // FileWriter(filename).read()
}
function on_will_parse_main(markdown,mode){
  //passage,powerpoint,post,none
  markdown = getYAML(markdown); // load YAML to docjson_global, and hide the YAML information in the final text.
  mode=docjson_global['mode'];
  // markdown = do_md_import(markdown);
  markdown = do_css_import(markdown,mode);
  markdown = katex_macro_replace(markdown);
  if(mode != "none"){
    if(mode =="zhihu"){
      markdown = transform_zhihu_type(markdown);
    } else {
      markdown = column(markdown);
      markdown = transform_labels(markdown);
      markdown = transform_unclosed_labels(markdown);
      if(mode=="powerpoint"){
        // markdown =transform_zhihu_type(markdown);
        
        markdown = transform_content(markdown,level=4);
        markdown = transform_biaoti(markdown,level=4);//通过把####级数以上的标题渲染时加入<!--slide -->和其内容加入\content，实现对markdown转ppt的自动排版，不用手动加入
        markdown = addHeader(markdown,docjson_global);
        markdown = addFooter(markdown,docjson_global);
        
      }
    }
  }
  return markdown;
};
function on_did_parse_main(mdhtml){
  //加入脚本/fontsize.js
  mode = docjson_global['mode'];
  if(mode=="powerpoint"){
    var string = "";
    string = fs.readFileSync(__dirname+"/fontsize.js");
    mdhtml+="<script>\n"+string+"\n</script>"; 
  }
  
  return mdhtml; 
}

function in_(query,array) {
  // a wheel.Just ignore it.
  for(var i=0;i<array.length;i++) {
    if(query == array[i]){
      return true;
    }
  }
  return false;
}
MaxRecursionDepth=4;
// default_attributes = {
//   "def":["name"],
//   "img":["src","name"]
// }
function transform_labels(markdown ){ 
   /**
   * transform unclosed labels like:
   * \def[definition1]{
   * 123
   * }
   *    |
   *    V
   * <div class="def">123</div>
   * 
   */
  // reg= /\\(.*?)\[(.*?)\]{(([^{}]|(\${1,2}[^\$]+?\${1,2}))+?)}/gm;
  reg_=/\\([\w]*?)((\[[^\[\]]*?\])+?){(([^{}]|(\${1,2}[^\$]+?\${1,2}))+?)\s*}/gm; //\xxx[a][b]{content} create an HTML element <xxx a..b>content</xxx>
  
  style_attributes = ['width','height','font','font-size','font-family','text-align','font-weight','font-style','background-color','color']; // these attributes will be put in "style" like:  "style":"width:100px;height:100px;"
  default_attributes = ["name"]; // its order is important
  
  replacement_ = function(whole,barname,attrs,lastlabel,content){
    // labellist=labels.match(/\[[^\[^\]]*?\]/gm);
    attrs = attrs.slice(1,-1);
    labellist = attrs.split("][");
    properties={};
    cnt = 0;
    for(var i = 0;i<labellist.length;i++){
      if(labellist[i].search("=") != -1){ //key=value
        
        key = labellist[i].split("=")[0];
        value = labellist[i].split("=")[1];
        properties[key]=value;
      } else {
        properties[default_attributes[cnt]]=labellist[i];// use default attribute
        cnt = ( cnt + 1 ) % default_attributes.length;
      }
    }
    style="";
    nonstyle = "";
    
    for (key in properties){
      value = properties[key];
      // if (key in style_attributes || key==style_attributes){
      if(in_(key,style_attributes)){
        style+= `${key}:${value};`;
      } else {
        nonstyle += `${key}=${value} `;
      }
    }
    ret= `<div class="${barname}" ${nonstyle} style="${style}">\n${content}\n</div>\n`;
    return ret;
  }
  for(var i=0;i<MaxRecursionDepth;i++){
    markdown = markdown.replace(reg_,replacement_);
  }
// -------------------------------------
  return markdown;
};

function transform_unclosed_labels(markdown,restricted_types=null){
  /**
   * transform unclosed labels like:
   * \img["1.png"] ---> <img src="1.png">
   * 
   * some other useage like:
   * \abc[key1="value1"][key2="value2"] ---> <abc key1="value1" key2="value2">
   * 
   * use style_attributes to determine which attribute should be put in the key:style
   * example: 
   * style_attributes = ["width"]
   * \abc[width=100px][class="123"] ---> <abc class="123" style="width:100px">
   * 
   * used default attributes to specify the properties without names specified.
   * default_attributes = ["src", "width"]
   * \img["1.png"]["300px"] ---> <img src="1.png" width="300px">
   */
  if(restricted_types != null){
    restricted= true;
  }else{
    restricted = false;    
  }
  reg_=/\\([\w]*?)((\[[\w :\/%=".-]*?\])+)/gm; 
  //\xxx[a][b]{content} create an HTML element <xxx a..b>content</xxx>
  style_attributes = ['width','height'];
  default_attributes = ["src"]; // its order is important
  replacement_ = function(whole,barname,attrs,lastlabel){
    // f = new FileWriter("D:/PKU/notes/QCQI/1.txt");
    // f.append(`label:${labellist[i]},result:${labellist[i].search("=")}
    // f.append(`restrict:${restricted},types:${restricted_types}\n`)
    if((restricted && !in_(barname,restricted_types))){
      //被限制，直接返回
      return whole;
    }
    attrs = attrs.slice(1,-1);
    labellist = attrs.split("][");
    properties={};
    cnt = 0;
    
    for(var i = 0;i<labellist.length;i++){
      
      if(labellist[i].search("=") != -1){ //key=value
        key = labellist[i].split("=")[0];
        value = labellist[i].split("=")[1];
        properties[key]=value;
      } else {
        properties[default_attributes[cnt]]=labellist[i];// use default attribute
        cnt = ( cnt + 1 ) % default_attributes.length;
      }
    }
    style="";
    nonstyle = "";
    for (key in properties){
      value = properties[key];
      if(in_(key,style_attributes)){
        style+= `${key}:${value};`;
      } else {
        nonstyle += `${key}=${value} `;
      }
    }
    ret= `<${barname} ${nonstyle} style="${style}">\n`;
    return ret;
  }
  markdown = markdown.replace(reg_,replacement_);
  return markdown;
}
function column(markdown,zhihu=false){ 
  // add columns using special grammar
  /**
   * can divide the content by two or three rows. 
   * format:
   * twocolumn:
   * left:
   * [your content here...]
   * right:
   * [your content here...]
   * end.
   * 
   * or:
   * 
   * threecolumn:
   * left:
   * [your content here...]
   * middle:
   * [your content here...]
   * right:
   * [your content here...]
   * end.
   */
  reg=/twocolumn:\s*left:([\w\W]*?)right:([\w\W]*?)end\./gm;
  replacement = '<div class="column"><div class="item">\n$1\n</div><div class="item">\n$2\n</div></div>'
  reg2=/threecolumn:\s*left:([\w\W]*?)middle:([\w\W]*?)right:([\w\W]*?)end\./gm;
  replacement2 = '<div class="column3"><div class="item">$1</div><div class=item">$2</div><div class="item">$3</div></div>'
  replacement_ = "$1\n$2\n"  // delete this information.
  replacement2_ = "$1\n$2\n$3\n" 
  if(zhihu){
    for(var i=0;i<MaxRecursionDepth;i++){
      markdown = markdown.replace(reg,replacement_);
      markdown = markdown.replace(reg2,replacement2_);
    }
  } else{
    for(var i=0;i<MaxRecursionDepth;i++){
      markdown = markdown.replace(reg,replacement);
      markdown = markdown.replace(reg2,replacement2);
    }
  }
  
  return markdown;
}
function transform_zhihu_type(markdown) {
  //该函数适用于多公式情形下向知乎公式转换
  //将行内、行间公式化为zhihu.com/equation站内公式，同时去除样式
  reg_selfdef_style =  /\\(.*?)\s*\[(.*?)\]\s*{([^{}$]*(((\${1,2}[\w\W]+?\${1,2})|({[^{}]*?}))[^{}$]*)*)}/gm;
  markdown = markdown.replace(reg_selfdef_style,"$3");
  markdown = markdown.replace(reg_selfdef_style,"$3"); 
  //每行末尾增加两个空格，用于将其解析为换行。
  // markdown = markdown.replace(/(.*?)\r?\n/gm,"$1  \r\n");
   //行内公式
  var reg_inline = /\$\$\s*([\w\W]*?)\s*\$\$/gm;
  var replacement_inline = function(word,tex){
    tex=tex.replace(/\r\n/gm,' '); //去掉所有空行
    return '\n<p><img src="https://www.zhihu.com/equation?tex='+encodeURIComponent(tex)+'" alt="[公式]" eeimg="1" loading="lazy" data-formula="'+tex+'"></p>\n';
  };
  markdown = markdown.replace(reg_inline,replacement_inline);
  //行间公式
  var reg_display = /\$\s*([\w\W]*?)\s*\$/gm;
  var replacement_display = function(word,tex){
    return '<img src="https://www.zhihu.com/equation?tex='+encodeURIComponent(tex)+'" alt="[公式]" eeimg="1" loading="lazy" data-formula="'+tex+'">';
  };
  markdown = markdown.replace(reg_display,replacement_display);  
  // 转换\img[]为<img src="xxx">
  markdown = transform_unclosed_labels(markdown,['img']);
  //去掉分栏信息
  markdown = column(markdown,true);
  return markdown;
};
function transform_biaoti(markdown,level){
  // let re = /^(#+)\s(.*?)$/gm
  let re = /^(#+)\ (.*?)$/gm;
  var transformation = function(whole,sharps,content){
    var ret="";
    var footer = docjson_global['footer'];
    if(!content && !footer){// 空标题,无页脚
      return "<!-- slide class=\"slide no-title-footer\" -->\n";
    }else if(!content && footer){//空标题，有页脚
      return "<!-- slide class=\"slide no-title\" -->\n";
    }else if(content && !footer){
      if(sharps.length<=level){
        ret+='<!-- slide class=\"slide no-footer\" -->\n'
      }
      return ret+'<div class="no-footer title'+sharps.length+'">\n\n'+content+' \n\n</div>\n'
    }else if(content&&footer){
      if(sharps.length<=level){
        ret+='<!-- slide class=\"slide title-footer\" -->\n'
      }
      return ret+'<div class="title-footer title'+sharps.length+'">\n\n'+content+' \n\n</div>\n'
    }
    
  }
  markdown = markdown.replace(re,transformation);
  return markdown;
}
function transform_content (markdown,level){ // put that before transform_header
  // let re = /((#+)\s.*?\n)(.*?)(?=#+\s.*?\n|$)/gs
  var re = /((#+)\s.*?\r?\n)\s*([^\s].*?)\s*(?=#+\s.*?|$)/gs
  var replace = function(whole,title,sharps,content){
    if(sharps.length<=level){
      return title+'\n<div class="content">\n\n'+content+'\n</div>\n';
    } else {
      return title;
    }
    // return title+'\n\\content[]{\n'+content+'\n}\n';
    
  };
  markdown = markdown.replace(re,replace);
  return markdown;
}

function getYAML(markdown){

// 文章开头的yaml使用指南：
// ---
// mode: [powerpoint|passage|zhihu]
// header : true // useful only in powerpoint mode
// footer : true // userful only in powerpoint mode
// date : "22-08-17" 
// author : "eihei"
// title : "slide-test"
// ---

  let re = /---\s*(.*?)\s*---/sg;
  let s = re.exec(markdown);
  if(!s){
    docjson_global={};
  } else {
    s=s[1].split("\n");
    json={};
    for(var i=0;i<s.length;i++){
      reg=/^\s*(.*?)\s*:\s*"?(.*?)"?\s*$/gm;
      ret=reg.exec(s[i]);
      console.log(ret);
      key=ret[1];
      val=ret[2];
      json[key]=val;
    }
    docjson_global=json;
  }
  default_mode="passage";
  if(!docjson_global['mode']){
    docjson_global['mode']=default_mode;
  }
  function replacement(whole,content){
    return `<!-- ${whole} -->`
  }
  markdown = markdown.replace(re,replacement);
  return markdown;
};
function addHeader(markdown,docjson_global){
  /**
   * In PPT mode, add a new page befor the first page ,
   * for presenting author,title and date.
   */
  var json_ = docjson_global;
  if(!json_['header']||json_['header']=='false'){
    return markdown;
  }
  date = json_['date'];
  author = json_['author'];
  title = json_['title'];
  var match = markdown.match(/<!-- slide .*?-->\s*/gm);

  res='';
  pair = match[0]; // before the first page
  
  idx= markdown.search(pair);
  markdown1=markdown.slice(0,idx+pair.length);
  markdown2=markdown.slice(idx);
  return markdown1+"<!--slide -->\n"+'<div class="title middle-screen">'+'<div class="title">'+json_['title']+'</div>\n<div class="author">'+json_['author']+'</div>\n<div class="date">'+json_['date']+"</div>\n</div>\n\n" +markdown2;
  // title class: middle-screen 
  // title: class=title 
  // author: class=author 
  //date: class=date
}

function addFooter(markdown,docjson_global){ 
  /**
   * In PPT mode, add footer for each document page,
   * for presenting author,title and date, and page.
   */
  var json_ = docjson_global;
  
  if(!json_['footer'] || json_['footer']=='false'){
    return markdown;
    //undefined 或false，不加入页脚
  }
  date=json_['date'];
  author=json_['author'];
  title=json_['title'];
  console.log(date,author,title);
  var match = markdown.match(/<!-- slide .*?-->\s/gm);
  var total_page=match.length;
  var res='';
  var cnt=1;
  while(match != null){
    pair = match[0];
    idx= markdown.search(pair);
    end = idx+ pair.length;
    res += markdown.slice(0,end);
    res += '<div class="footer column4"><div class="item">'+author+'</div><div class="item" style="text-align:center">'+title+'</div><div class="item" style="text-align:center">'+date+'</div><div class="item" style="text-align:right">'+String(cnt)+'/'+total_page+'</div></div>\n\n';
    markdown = markdown.slice(end);
    console.log(markdown);
    match = markdown.match(/<!-- slide .*?-->\s/gm);
    cnt+=1;
  }
  res+=markdown;
  return res;
};

// used for debugging.
class FileWriter{
  constructor(path) {
    this.fs = require("fs");
    this.path=path;
  };
  read(){
    this.fs.readFile()
    this.fs.readFile(this.path, function (err,data) {
      if (err) {
          throw new Error("失败")
      } else {
          return data;
      }
  });
  }
  write(content){
    return this.fs.writeFile(this.path,content,function (err) {
      if (err) {
          throw new Error("失败")
      } else {
          console.log("成功")
      }
  });
  }
  append(content){
    return this.fs.appendFile(this.path,content,function (err) {
      if (err) {
          throw new Error("失败")
      } else {
          console.log("成功")
      }
  });
  }
}