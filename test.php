<?php
	header("Context-Type:text/html;charset=utf-8");
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
			$s->title = $row['title'];
			//$s->title = str_replace(' ','&nbsp;',$row['title']);
			$s->label = $row['label'];
			//$s->article = $row['article'];
			
			$s->article = str_replace("\r\n",'<br>',$row['article']);
			$s->article = str_replace(' ','&nbsp;',$s->article);
			//$s->article = str_replace(,' ',$s->article);
			$s->timeline = $row['timeline'];
			$arr[] = $s;
		}
		
		echo json_encode(array("blog"=>$arr));
		$_result->free();
		
		$_mysqli->close();

?>
