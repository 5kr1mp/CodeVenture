
$(document).ready(async()=>{
const actName = $("#activityName")
const currItem = $("#current-item")
const qsTxt = $("#question")
const choicesContainer = $("#choices")
const choicesBtn = $(".choice")
const nextBtn = $("#next")
const currentActivity = await webContent.activity.getActivity(localStorage.getItem('current-activity-index'))
const activities = await webContent.course.getActivities()
const course = await webContent.getCourse()
const currCourse = await progress.getCurrentCourse(course)
const userProgress = currCourse['progress']['activities completed']
const nextActivityIndex = parseInt(localStorage.getItem('current-activity-index'))
const nextActivity = await webContent.activity.getActivity(nextActivityIndex)
let questionIndex = 0;
let score = 0;

async function loadQuiz(){
    //instantiate values

    //page title
    $("title").text($("title").text()+" - "+ await webContent.course.getCourseName())
    //activity name
    actName.text(currentActivity['activity name'])
    //items
    currItem.text(questionIndex + 1 +".")
    //question
    qsTxt.text(currentActivity['questions'][questionIndex])
    //choices
    let choiceIndex = 0;
    choicesBtn.each((index, element) => {
        $(element)
            .text(currentActivity['choices'][questionIndex][choiceIndex])
            .on('click',function(){
                check(index)
            })
            .removeClass(['wrong','correct'])
        choiceIndex++
    })
    //next button
    if(questionIndex + 1 == currentActivity['questions'].length){
        nextBtn.text("Finish")
    } else {
        nextBtn.text("Next")
    }
    nextBtn.hide()
}
function check(index){
    let correctAnswer = currentActivity['correct answers'][questionIndex]
    let audio;
    if (correctAnswer == index){
        audio = new Audio('assets/correct-quiz.mp3')
        audio.play()
        $(choicesBtn[index]).addClass("correct")
        choicesBtn.each((i,e) => {
            $(e).off()
        });
        nextBtn.show()
        score++;
        // console.log(score)
    } else {
        audio = new Audio('assets/wrong-quiz.mp3')
        audio.play()
        $(choicesBtn[index]).addClass("wrong")
        choicesBtn.each((i,e) => {
            $(e).off()
        });
        nextBtn.show()
    }
}

nextBtn.on('click',async function(){
    questionIndex++;
    if(questionIndex < currentActivity['questions'].length){
        console.log(questionIndex < currentActivity['questions'].length)
        await loadQuiz()
    } else {
        progress.updateQuizScore(score,course)
        .then(()=>{
            goToNextActivity()
        })
    }
})


function goToNextActivity(){
    // if(nextActivityIndex < activities.length){
    //     localStorage.setItem('current-activity-index',nextActivityIndex)
    //     if(nextActivity['type']==0){
    //         location.replace('/activity.html')
    //     } else {
    //         location.replace('/quiz.html')
    //     }
    // } else {
        congratulate()
    // }
}

async function congratulate(){
    $("body").append(
        $('<div hidden id="congratulations"><div id="container"><h1>Congratulations on completing the <span class="course-name"></span> course!</h1><p>You can check out other courses in the home page</p><button id="close-window">close window</button></div>')
    )
    $("#congratulations").show()
    $("#close-window").click(async()=>{
        progress.updateCourseProgress(userProgress,course)
        .then(()=>{
            window.location.replace('course.html')
        })
    })
}


loadQuiz()
})
