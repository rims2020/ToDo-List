const express= require("express");
const bodyParser=require("body-parser")
const mongoose=require("mongoose");
const app=express()
var _=require("lodash");
const date=require(__dirname + "/date.js")
console.log(date);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin:testone@cluster0-hhnl7.mongodb.net/todolistDB",{useNewUrlParser:true});


const workSchema={
    name:"String"
}
const jobSchema={
    name:"String",
items:[workSchema]
}
const Job=mongoose.model("Job", jobSchema);
const Work=mongoose.model("Work",workSchema);

const play=new Work({
    name:"Welcome To ToDo List"
})

const sleep=new Work({
    name:"Type And Hit + To Save"
})
const cook=new Work({
    name:"Check The Textbox To Delete"
})
const defaultItems=[play,cook,sleep];

//Work.insertMany(defaultItems,function(err)
//{
  //  if(err)
   // {
    //    console.log(err)
    //}
   // else{
     //   console.log("Insertion Success")
   //}
//})

app.get("/", function(req,res)
{
   
   Work.find(function(err, work)
   {
       if (err){
           console.log(err)
       }
       else
       { 
           res.render("lists", {kindofday: "Today", todo:work });
            }
   }) 
   
});

app.post("/", function(req,res)
{
    const item=req.body.listitem;
const jobname= req.body.list;
    item_1= new Work({
name:item
    })
  if (jobname=="Today")
  {
    item_1.save();
    res.redirect("/")
  }
  else
  {
Job.findOne({name:jobname},function(err,foundlists)

{
    foundlists.items.push(item_1)
    foundlists.save();
    res.redirect("/" + jobname);
})
  }

});
app.post("/delete", function(req, res)
{
    
const delete_id=req.body.checkbox
const delete_item=req.body.hiddeninput
if (delete_item=="Today")
{
   Work.findByIdAndRemove(delete_id,function(err)
   {
       if(!err)
       {
           console.log("Successfully deleted")
           res.redirect("/")
       }
   }) 
}
else
{

    console.log(delete_item)
    Job.findOneAndUpdate({name:delete_item},{$pull:{items:{_id:delete_id}}}, function(err, foundlists)
{
if(!err)
{
    console.log("Deleted")
  res.redirect("/" + delete_item)
}
else
{
    console.log("Not deleted")
}
}
)
}
    


});
app.get("/:customlistname",function(req,res)
 { 
    const m=_.capitalize(req.params.customlistname)
    Job.findOne({name:m},function(err,foundlist)
{
    if (!err)
    {
        if (!foundlist)
        {
            console.log("Dosent Exists")
            const job=new Job({
                name:m,
                items:defaultItems
            });
            job.save();
            res.redirect("/"+ m);
        }
        else
        {
            console.log("Exists")
            res.render("lists",{kindofday:foundlist.name, todo:foundlist.items})
        }
    }
});

});


let port=process.env.PORT;
if(port==null||port=="")
{
    port=3000;
}
app.listen(port, function(){
    console.log("app started");
})


