<?php
    header("Context-Type:text/html;charset=utf-8");
	/////////////////////////////////////////////////////////////////////
	//当提交后更新数据
	$flag = $_REQUEST["flag"];
	if ($flag == "article_summit")
	{
		$title = $_POST["area_title"];
		$label = $_POST["area_label"];
		$article = $_POST["area_article"];
		
		$_mysqli = new mysqli('localhost','root','masongzhi','masongzhi');
		$_mysqli->set_charset("utf-8");
		$_sql = "INSERT INTO blog(title,label,article) VALUES('$title','$label','$article')";
		if (!empty($title & $article) || $title===0 || $title==="0" || $article===0 || $article==="0")
		{
			if (!$_mysqli->query($_sql))
			{
				//echo 'error:' .$_mysqli->error;
			}
				//echo "插入数据库成功";
				$echo = json_encode(array("result"=>"good"));
				
		}
		
		
		$_mysqli->close();
	}
	//页面刷新更新数据 
	else if($flag == "page") 
	{
		$_mysqli = new mysqli('localhost','root','masongzhi','masongzhi');
		$_mysqli->set_charset("utf-8");
		$_sql = "SELECT * FROM blog";
		$_result = $_mysqli->query($_sql);
		
		class Stu{
			 public $id;
			 public $title;
			 public $label;
			 public $article;
			 public $timeline;
		}
		while($row = mysqli_fetch_assoc($_result))
		{
			$s = new Stu();
			$s->id = $row['id'];
			//将输出中的空格和换行符替换成html元素
			//$s->title = $row['title'];
			$s->title = str_replace(' ','&nbsp;',$row['title']);
			$s->label = $row['label'];	
			//$s->article = $row['article'];	
			//将article中的空格和换行替换
			$s->article = str_replace("\r\n",'<br>',$row['article']);
			$s->article = str_replace(' ','&nbsp;',$s->article);
			$s->timeline = $row['timeline'];
			$arr[] = $s;
		}
		
		$echo = json_encode(array("blog"=>$arr));
		
		$_result->free();
		$_mysqli->close();
	}
	//提交评论
	else if($flag == "comment_summit")  
	{
		$id = $_REQUEST["id"];
		//$commentator = $_REQUEST["commentator"];
		$comment_text = $_REQUEST["comment_text"];
		$_mysqli = new mysqli('localhost','root','masongzhi','masongzhi');
		$_mysqli->set_charset("utf-8");
		$_sql = "INSERT INTO blog_comment(id,commentator,comment_text) VALUES('$id','','$comment_text')";
		if (!empty($comment_text) || $comment_text===0 || $comment_text==="0")
		{
			if ($_mysqli->query($_sql))
			{
				$_sql = "SELECT * FROM blog_comment WHERE id=$id";
				$_result = $_mysqli->query($_sql);
				class Stu{
					 public $id;
					 public $commentator;
					 public $comment_text;
					 public $comment_time;
				}
				while($row = mysqli_fetch_assoc($_result))
				{
					$s = new Stu();
					$s->id = $row['id'];
					$s->commentator = $row['commentator'];
					$s->comment_text = str_replace(' ','&nbsp;',$row['comment_text']);	
					$s->comment_text = str_replace("\r\n",'<br>',$row['comment_text']);
					$s->articcomment_text = str_replace(' ','&nbsp;',$s->comment_text);
					$s->comment_time = $row['comment_time'];
					$arr[] = $s;
				}
					
				$echo = json_encode(array("blog_comment"=>$arr));
				$_result->free();
			}
		}
			
				
		//$echo = json_encode(array("result"=>"good"));
		$_mysqli->close();
	}
	else if($flag == "comment_show")  
	{
		$id = $_REQUEST["id"];
		$_mysqli = new mysqli('localhost','root','masongzhi','masongzhi');
		$_mysqli->set_charset("utf-8");
		
		$_sql = "SELECT * FROM blog_comment WHERE id=$id";
		$_result = $_mysqli->query($_sql);
		class Stu{
			 public $id;
			 public $commentator;
			 public $comment_text;
			 public $comment_time;
		}
		while($row = mysqli_fetch_assoc($_result))
		{
			$s = new Stu();
			$s->id = $row['id'];
			$s->commentator = $row['commentator'];
			$s->comment_text = str_replace(' ','&nbsp;',$row['comment_text']);	
			$s->comment_text = str_replace("\r\n",'<br>',$row['comment_text']);
			$s->articcomment_text = str_replace(' ','&nbsp;',$s->comment_text);
			$s->comment_time = $row['comment_time'];
			$arr[] = $s;
		}
					
		$echo = json_encode(array("blog_comment"=>$arr));
		$_result->free();
	}
	else if($flag == "login")
	{
		$user = $_REQUEST["login-user"];
		$passwd = $_REQUEST["login-passwd"];
		if ($user == "masongzhi" & $passwd == "masongzhi")
		{
			$echo = json_encode(array("result"=>"good"));
		}
	}
	//查看原文
	else if($flag == "blogPage")
	{
		$id = $_REQUEST["id"];
		$_mysqli = new mysqli('localhost','root','masongzhi','masongzhi');
		$_mysqli->set_charset("utf-8");
		$_sql1 = "SELECT * FROM blog WHERE id=$id";
		
		$_result1 = $_mysqli->query($_sql1);
	
		//文章
		class Stu1{
			 public $id;
			 public $title;
			 public $label;
			 public $article;
			 public $timeline;
		}
		
		while($row1 = mysqli_fetch_assoc($_result1))
		{
			$s1 = new Stu1();
			$s1->id = $row1['id'];
			$s1->title = str_replace(' ','&nbsp;',$row1['title']);
			$s1->label = $row1['label'];				
			$s1->article = str_replace("\r\n",'<br>',$row1['article']);
			$s1->article = str_replace(' ','&nbsp;',$s1->article);
			$s1->timeline = $row1['timeline'];
			$arr1[] = $s1;	
		}
		
		
		
		//输出
		$echo = json_encode(array("blog"=>$arr1));
	}
	
	
	echo $echo;
	
	
	
	
	
?>