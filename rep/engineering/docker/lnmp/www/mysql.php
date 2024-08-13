<?php
// 创建连接
$conn = new mysqli('lnmp-mysql', 'root', 123456);
if($conn->connect_error){
    die("连接失败，错误:" . $conn->connect_error);
}
echo "connect success";