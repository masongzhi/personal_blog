/**
 * Created by masongzhi on 2016/8/23.
 */
//页面加载更新数据并创建dom节点
$(function(){
    updateBlog();
})

//点击回复显示回复内容框
function clickComment(e){
    //e.nextSibling获取当前节点的下一个节点
    if ($(e.nextSibling).css("display") == "none"){
        //把其他已打开的评论隐藏
        $(".comment-area:visible").css("display","none");
        $(".blog-comments").css("display","none")
        //打开当前的评论框
        $(e.nextSibling).css("display","inline")
        $(e.nextSibling.nextSibling).css("display","inline")
        $(e.nextSibling.nextSibling).html("")
        $.ajax({
            url:"blog.php",
            type:"post",
            dataType:"json",
            data:{
                flag:"comment_show",
                id:$(e).attr("id")
            },
            success:function(data){
                //直接刷新页面
                console.log()
                var id;var comment_text;var comment_time;var commentator;
                for (var i = 0 ; i<data.blog_comment.length; i++){
                    id = data.blog_comment[i].id;
                    comment_text = data.blog_comment[i].comment_text;
                    comment_time = data.blog_comment[i].comment_time;
                    commentator = data.blog_comment[i].commentator;

                    var $div = $("<div class='blog-comments'>" +
                        "<p>"+commentator+"<span>"+comment_text+"</span></p>" +
                        "<span class='comment_time'>"+comment_time+"</span>" +
                        "</div>")
                    $(e.nextSibling.nextSibling).append($div);
                }
            },
            error:function(){
                console.log("error")
            }
        })
    }
    else {
        $(e.nextSibling).css("display","none")
        $(e.nextSibling.nextSibling).css("display","none")
    }



}

//封装更新blog函数
function updateBlog(clickPage){
    //清空article
    $("article").html("");
    $(".pages").html("");
    //替换当前的url
    if (clickPage){
        var href = window.location.href;
        //替换url
        window.location.href = '#flag='+clickPage;
    }
    else {
        clickPage = 1;
    }
    console.log(clickPage)

    $.ajax({
        url:"blog.php",
        type:"post",
        dataType:"json",
        data:{
            flag:"page"
        },
        async:true,
        success:function(data){
            console.log(data)
            createBlog(data,clickPage);
            //创建页码
            var pages = Math.ceil(data.blog.length/10);
            for (var i =1 ; i<pages+1 ; i++){
                //这里创建a标签时，想要把i放进updateBlog()函数中，所以用字符拼接的方法（想了好久。。）
                var $span = $("<a href='javascript:void(0)' onclick='updateBlog("+i+")'>"+i+"</a>");
                $(".pages").append($span);
            }
            var pageWidth = (pages+1)*20+pages*50;
            $(".pages").css("width",pageWidth);
        },
        error:function(){
            console.log("更新数据不成功")
        }
    })

}

//提交数据
function form_submit(){
    var content = $("#form-submit").serialize();
    //content = decodeURIComponent(content);
    console.log(content)
    $.ajax({
        url:"blog.php",
        type:"post",
        dataType:"json",
        data:content,
        success:function(data){
            //直接刷新页面
            location.reload();

            console.log(data)
        },
        error:function(){
            console.log("error")
        }
    })
}

//提交评论数据并更新数据
function commentSummit(e){

    var comment_text = $(e.previousSibling).val();
    console.log($(e).attr("id"))
    $.ajax({
        url:"blog.php",
        type:"post",
        dataType:"json",
        data:{
            comment_text:comment_text,
            flag:"comment_summit",
            id:$(e).attr("id")
        },
        success:function(data){
            //移除评论区的评论，避免重复加载
            $(".blog-comments").remove()

            var id;var comment_text;var comment_time;var commentator;
            for (var i = 0 ; i<data.blog_comment.length; i++){
                id = data.blog_comment[i].id;
                comment_text = data.blog_comment[i].comment_text;
                comment_time = data.blog_comment[i].comment_time;
                commentator = data.blog_comment[i].commentator;
                var $div = $("<div class='blog-comments'>" +
                        "<p>"+commentator+"<span>"+comment_text+"</span></p>" +
                        "<span class='comment_time'>"+comment_time+"</span>" +
                    "</div>")
                $(e).after($div);
            }
            $(e.previousSibling).val("")
        },
        error:function(){
            console.log("error")
        }
    })
}

//查看原文
function blogPage(i){
    $.ajax({
        url:"blog.php",
        type:"post",
        dataType:"json",
        data:{
            id:i,
            flag:"blogPage"
        },
        success:function(data){
            console.log(data)
            $("article").empty()
            $(".summit-form").remove()
            $(".pages").remove()
            $("#login").html("")

            var $div = $("<div class='blogPage'>" +
                    "<div class='blogPage-header'>" +
                        "<div class='blogPage-title'>"+data.blog[0].title+"</div>" +
                        "<div class='blogPage-timeline'>"+data.blog[0].timeline+"</div>" +
                    "</div>" +
                    "<div class='blogPage-article'>"+data.blog[0].article+"</div>" +
                "</div>" +
                    /*评论区*/
                "<div class='blogPage-comment'>" +
                    "<span onclick='clickComment(this)' id='"+i+"'><img src='comment_logo.png' alt='comment_logo'>回复</span>" +
                    "<div class='comment-area' style='display: none'>" +
                    "<textarea type='text' placeholder='评论内容'></textarea>" +
                    "<span onclick='commentSummit(this)' id='"+i+"'>评论</span>" +
                    "</div>" +
                    "<div class='comment-area-comments'></div>" +
                "</div>")

                $("article").append($div)
        },
        error:function(){
            console.log("error")
        }
    })
}


//封装创建节点函数
function createBlog(data,page){
    page = data.blog.length-1-10*(page-1);
    var id;var title;var label;var article;var timeline;
    //每条数据创建一个dom节点
    for (var i =page ; i>page-10 ; i--){
        //当i = 0时执行最后一次
        if (i < 0){
            break;
        }
        //获取返回数据中的内容
        id = data.blog[i].id;
        title = data.blog[i].title;
        label = data.blog[i].label;
        article = data.blog[i].article;
        timeline = data.blog[i].timeline;
        var ii = i +1;
        //创建节点元素
        var $div = $("<section><div>" +
            "<h2 class='blog-article-title' onclick='blogPage("+ii+")'>"+title+"</h2>" +
            "<div class='blog-article-label'>"+label+"</div>" +
            "<div class='blog-article-article'>"+article+"</div>" +
            "<p class='blog-article-time'>"+timeline+"</p>" +
            "<div class='blog-article-comment'>"+
                "<span onclick='clickComment(this)' id='"+ii+"'><img src='comment_logo.png' alt='comment_logo'>回复</span>" +
                "<div class='comment-area' style='display: none'>" +
                    "<textarea type='text' placeholder='评论内容'></textarea>" +
                    "<span onclick='commentSummit(this)' id='"+ii+"'>评论</span>" +
                "</div>" +
            "<div class='comment-area-comments'></div>" +
            "</div>" +
            "</div></section>");
        $("article").append($div);
    }

}

//显示登陆界面
function showLogin(){
    if($(".login").css("display")== "none"){
        $(".login").css("display","block")
    }
    else {
        $(".login").css("display","none")
    }

}
//显示登陆表单
$("#login-btn").click(function () {
    var content = $("#login-form").serialize()
    console.log(content)
    $.ajax({
        url: "blog.php",
        type: "post",
        dataType: "json",
        data:content,
        success: function (data) {
            console.log(data.result)
            if (data.result == "good"){
                var $div = $("<form action='' method='post' id='form-submit'>" +
                    "<div>" +
                    "<input type='text' id='area-title' name='area_title' placeholder='标题'>" +
                    "<input type='text' id='area-label' name='area_label'>" +
                    "<textarea name='area_article' id='area-article' placeholder='内容'></textarea>" +
                    "<!--发送flag，判别提交与更新数据-->"+
                    "<input name='flag'' style='display: none' value='article_summit' >"+
                    "<input type='button' id='btn-submit' value='发表' onclick='form_submit()'>"+
                    "</div>" +
                    "</form>")
                $(".summit-form").append($div);
            }
            $(".login").css("display","none")
        }
    })
})