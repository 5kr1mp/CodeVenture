$(document).ready(()=>{
const textBox = $("#text")
const exampleCodeBox = $("#example")
const choices = $("#choices")
const instructions = $("#instructions")
const checkBtn = $("#check")
const continueBtn = $("#continue")
const activityName = $("#activityName")
let currentActivity;
let blankList;
let course;
let currCourse;
let userProgress;
let nextActivity;
let nextActivityIndex
let activities;

async function loadActivity(){
    $("dotlottie-player").hide()
    //instantiate values
    currentActivity = await webContent.activity.getActivity(localStorage.getItem('current-activity-index'))
    activities = await webContent.course.getActivities()
    nextActivityIndex = parseInt(localStorage.getItem('current-activity-index'))+1
    nextActivity = await webContent.activity.getActivity(nextActivityIndex)
    course = await webContent.getCourse()
    currCourse = await progress.getCurrentCourse(course)
    userProgress = currCourse['progress']['activities completed']

    //page title
    $("title").text($("title").text()+" - "+ await webContent.course.getCourseName())
    //Activity name
    activityName.text(currentActivity['activity name'])
    //Text
    textBox.prepend(
        $("<div/>").html(currentActivity['text'])
    )
    //Instructions
    instructions.html(currentActivity['instructions'])
    //Example Code Box
    currentActivity['answer box'].forEach(element => {
        const line = $("<p/>")
        element.forEach(segment =>{
            if(segment["type"] == 0){//if the segment is a normal text
                line.append(
                    $("<span/>").html(segment["text"])
                )
            } else if (segment["type"] == 1){//if the segment is a blank text
                line.append(
                    $("<span/>",{'class':'blank'}).text("?")
                )
            }
        })
        exampleCodeBox.append(line) 
    })
    blankList = $(".blank")
    //Choices
    currentActivity['choices'].forEach(choice => {
        choices.append(
            $("<button/>",{'class':'choice','data-choice':choice['data']})
                .text(choice['text'])
                .click(function(){
                    const btn = $(this)
                    let blank;
                    if(btn.parent().attr('id') == "choices"){ //if the button is in the choices box
                        blankList.each(function(index){
                            if($(blankList[index]).children().length == 0){
                                $(blankList[index]).html(btn);
                                return false;
                            }
                        })
                    } else {
                        blank = btn.parent()
                        choices.append($(btn))
                        blank.text("?")
                    }
                })
        )
    })
}
function showPopup(isCorrect){
    var audio;
    const container = $("#choices-container")
    const containerChildren = container.children()
    if(isCorrect){
        $(containerChildren).toggle()
        $("#response").text("You are correct!").removeClass("wrong")
        $(".choice").off()
        audio = new Audio('assets/correct-quiz.mp3')
        audio.play()
    } else{
        audio = new Audio('assets/wrong-audio.mp3')
        audio.play()
        $(containerChildren).toggle()
        $("#continue").hide()
        $("#response").html("Wrong!").addClass("wrong")
        $("#choices-container").addClass("wrong")
        $("iframe").hide()
        setTimeout(function(){
            $("#choices-container").removeClass("wrong")
            $(containerChildren).toggle()
            $("iframe").hide()
            $("#continue").hide()
        },800)
    }
}
checkBtn.on('click',function(){
    blankList = $(".blank")
    let correct = true
    blankList.each(function(i){
        if(i != $(blankList[i]).children().attr('data-choice')){
            correct = false;
            return false;
        }
    })
    showPopup(correct)
})
continueBtn.on('click',function(){
    completeActivity()
    .then(()=>{
        if(nextActivityIndex < activities.length){
            localStorage.setItem('current-activity-index',nextActivityIndex)
            if(nextActivity['type']==0){
                location.reload()
                console.log("Type 0")
            } else {
                location.replace('quiz.html')
                console.log("type 1")
            }
        } else {
            location.replace('course.html')
            console.log("ELSE")
        }
    })
})

async function completeActivity(){
    if(userProgress < parseInt(localStorage.getItem('current-activity-index'))+1){
        await progress.updateCourseProgress(course)
    }
}

$("#back-to-course").on('click',function(){
    location.replace('course.html')
})
loadActivity()
})
