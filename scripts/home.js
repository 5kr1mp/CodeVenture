
$(document).ready(()=>{

    async function loadHome(){
        const response1 = await fetch(COURSES_URL)
        const courses = await response1.json()
        const progressList = [];
        for(let i = 0; i < courses.length; i++){
            let currProgress = await progress.getCourseProgress(courses[i])
            progressList.push(currProgress)
        }
        // console.log(progressList)
        courses.forEach((course,index) => {
            progressList.push(progress.getCourseProgress(course))
            $("#courses").append(createCourseItemElement(course,index,progressList))
        });
    }

    
    
    function createCourseItemElement(course,index,list){
        return $('<div/>',{'class':'course-item'}).append([
            $('<h1/>',{'class':'course-name'})
                .text(course.name),
    
            $('<p/>',{'class':'course-desc'})
                .text(course.desc),
            
            $("<div/>").append([
                $("<button/>")
                    .text("Continue")
                    .click(()=>openCourse(course.id)),
                
                $("<span/>").append([
                    $("<p/>").html(
                        "Progress: "+list[index]+"%"
                    ),
                    $("<meter/>",{'min':0,'max':100,}).val(list[index])
                ])
            ])
        ])
    }
    
    function openCourse(courseId){
        localStorage.setItem("course-id",courseId)
        window.location.href='course.html'
    }

    loadHome()
})



