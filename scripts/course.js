$(document).ready(()=>{
const courseNameText = $("#course-name")
const courseDescText = $("#course-desc")
const courseProgressText = $("#course-progress")
const meter = $("meter")
let quizScore;

async function loadCourse(){
    //get course
    const course = await webContent.getCourse()
    const currCourse = await progress.getCurrentCourse(course)
    const userProgress = currCourse['progress']['activities completed']
    quizScore = await progress.getQuizScore(course)

    
    //page title
    $("title").text($("title").text()+" - "+ await webContent.course.getCourseName())
    //texts
    courseDescText.text(await webContent.course.getCourseDesc())
    $(".course-name").text(await webContent.course.getCourseName())
    courseNameText.text(await webContent.course.getCourseName())
    courseProgressText.text(await progress.getCourseProgress(await webContent.getCourse()))
    meter.val(await progress.getCourseProgress(course))
    //activities
    const activities = await webContent.course.getActivities()
    activities.forEach(function(element, index){
        $("#activities").append(createActivityElement(course,index))
    });
    
    $(".activity").each((index,element)=>{
        console.log(index +" : "+userProgress)
        if(index<userProgress){
            console.log(index +" : "+userProgress)
            $(element).addClass("completed")
            $(element).removeClass("locked")
        } else if (index == userProgress){
            console.log(index +" : "+userProgress)
            $(element).removeClass("locked")
            $(element).removeClass("completed")
        } else {
            console.log(index +" : "+userProgress)
            $(element).removeClass("completed")
            $(element).addClass("locked").off()
            
        }
    })
}
function createActivityElement(course,activityIndex){
    const activity = course['activities'][activityIndex]
    const activityElement = $("<button/>",{'class':'activity'})
        .append(
            $("<h1/>").text(activity['activity name'])
        )
        .click(()=>{
            openActivity(course,activityIndex)
        })
    if(activity['type'] == 1){
        activityElement.append(
            $('<h1/>')
                .append(
                    $("<span/>",{'class':'score'})
                        .text(quizScore+"/")
                )
                .append(
                    $("<span/>",{'class':'items'})
                        .text(activity['questions'].length)
                )
        )
    }
    return activityElement;
}
function openActivity(course,activityIndex){
    if(course['activities'][activityIndex]['type'] == 0){ //if the activity is of Lesson Type
        window.location.assign("activity.html")
    } else if(course['activities'][activityIndex]['type'] == 1){//if the activity is of Quiz Type
        window.location.assign("quiz.html")
    } 
    localStorage.setItem('current-activity-index',activityIndex)
}

$("#continue").click(async ()=>{
    const course = await webContent.getCourse()
    const currCourse = await progress.getCurrentCourse(course)
    const userProgress = currCourse['progress']['activities completed']

    if(await progress.getCourseProgress(course)==100){
        openActivity(course,userProgress-1)
    } else{
        openActivity(course,userProgress)
    }
})




loadCourse()
})