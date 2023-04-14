/*
SQLyog Community v13.2.0 (64 bit)
MySQL - 10.4.27-MariaDB : Database - shipments
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`shipments` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `shipments`;

/*Table structure for table `city` */

DROP TABLE IF EXISTS `city`;

CREATE TABLE `city` (
  `id` int(11) NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `postalCode` int(5) DEFAULT NULL,
  `county_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `county_id` (`county_id`),
  CONSTRAINT `city_ibfk_1` FOREIGN KEY (`county_id`) REFERENCES `county` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `city` */

insert  into `city`(`id`,`name`,`postalCode`,`county_id`) values 
(1,'Zagreb',10000,1),
(2,'Dugo Selo',10370,2),
(3,'Velika Gorica',10410,2),
(4,'Krapina',49000,3),
(5,'Zabok',49210,3);

/*Table structure for table `county` */

DROP TABLE IF EXISTS `county`;

CREATE TABLE `county` (
  `id` int(11) NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `county` */

insert  into `county`(`id`,`name`) values 
(1,'Grad Zagreb'),
(2,'Zagrebačka županija'),
(3,'Krapinsko-zagorska županija');

/*Table structure for table `product` */

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `product` */

insert  into `product`(`id`,`name`) values 
(1,'Samsung Galaxy S22'),
(2,'Huawei ruter'),
(3,'Samsung Galaxy Tab S8');

/*Table structure for table `shipment` */

DROP TABLE IF EXISTS `shipment`;

CREATE TABLE `shipment` (
  `status` varchar(32) DEFAULT NULL,
  `creation_date` date DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `user_oib` varchar(11) DEFAULT NULL,
  `delivery_city_id` int(11) DEFAULT NULL,
  `delivery_house_number` varchar(8) DEFAULT NULL,
  `receipt_city_id` int(11) DEFAULT NULL,
  `receipt_house_number` varchar(8) DEFAULT NULL,
  `delivery_street_name` varchar(256) DEFAULT NULL,
  `receipt_street_name` varchar(256) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `user_oib` (`user_oib`),
  KEY `delivery_city_id` (`delivery_city_id`),
  KEY `receipt_city_id` (`receipt_city_id`),
  CONSTRAINT `shipment_ibfk_1` FOREIGN KEY (`user_oib`) REFERENCES `user` (`oib`),
  CONSTRAINT `shipment_ibfk_2` FOREIGN KEY (`delivery_city_id`) REFERENCES `city` (`id`),
  CONSTRAINT `shipment_ibfk_3` FOREIGN KEY (`receipt_city_id`) REFERENCES `city` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `shipment` */

insert  into `shipment`(`status`,`creation_date`,`delivery_date`,`user_oib`,`delivery_city_id`,`delivery_house_number`,`receipt_city_id`,`receipt_house_number`,`delivery_street_name`,`receipt_street_name`,`id`) values 
('DELIVERED','2023-03-31','2023-04-01','09876543210',2,'11',2,'11','Savska','Savska',1),
('NOVO','2023-04-01','2023-04-04','01234567890',2,'11',2,'11','Savska','Savska',3),
('DELIVERED','2023-04-02','2023-04-05','09876543210',3,'6d',3,'21','Petrinjska','Dugoselska',4),
('DELIVERED','2023-04-06','2023-04-07','01234567890',2,'6d',3,'21','Petrinjska','Dugoselska',5),
('NOVO','2023-04-12','2023-04-20','01234567890',1,'64b',2,'12c','Radnicka','Savska',32),
('DELIVERED','2023-04-12','2023-04-20','01234567890',1,'64b',2,'12c','Radnicka','Savska',33),
('NOVO','2023-04-12','2023-04-20','01234567890',1,'64b',2,'12c','Radnicka','Savska',34);

/*Table structure for table `shipment_products` */

DROP TABLE IF EXISTS `shipment_products`;

CREATE TABLE `shipment_products` (
  `shipment_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  KEY `shipment_id` (`shipment_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `shipment_products_ibfk_1` FOREIGN KEY (`shipment_id`) REFERENCES `shipment` (`id`),
  CONSTRAINT `shipment_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `shipment_products` */

insert  into `shipment_products`(`shipment_id`,`product_id`,`amount`) values 
(1,1,1),
(3,2,1),
(3,3,1),
(4,1,2),
(33,1,2),
(33,2,1),
(5,1,2),
(5,2,1),
(34,1,1),
(34,2,1);

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `oib` varchar(11) NOT NULL,
  `name` varchar(256) DEFAULT NULL,
  `surname` varchar(256) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `email` varchar(320) DEFAULT NULL,
  PRIMARY KEY (`oib`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `user` */

insert  into `user`(`oib`,`name`,`surname`,`phone_number`,`email`) values 
('01234567890','Ivan','Horvat','+385992149866','ivan.horvat@gmail.com'),
('09876543210','Pero','Peric','+38598257963','pperic@yahoo.com');

/* Procedure structure for procedure `ShipmentInfo` */

/*!50003 DROP PROCEDURE IF EXISTS  `ShipmentInfo` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `ShipmentInfo`(IN p_id INT)
BEGIN
	if p_id IS NULL THEN
		SELECT 
		ShipmentID, STATUS, Creation_Date, Delivery_Date,
		User_Name, User_Surname, User_Phone, User_Email,
		Delivery_City, Delivery_Street, Delivery_Address, Delivery_County,
		Receipt_City, Receipt_Street, Receipt_Address, Receipt_County
		FROM ShipmentView;
	ELSE
		select
		ShipmentID, STATUS, Creation_Date, Delivery_Date,
		User_Name, User_Surname, User_Phone, User_Email,
		Delivery_City, Delivery_Street, Delivery_Address, Delivery_County,
		Receipt_City, Receipt_Street, Receipt_Address, Receipt_County
		from ShipmentView
		WHERE ShipmentID = p_id;
	end if;
END */$$
DELIMITER ;

/* Procedure structure for procedure `ShipmentProducts` */

/*!50003 DROP PROCEDURE IF EXISTS  `ShipmentProducts` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `ShipmentProducts`(IN p_id VARCHAR(11))
BEGIN

	SELECT product_id id, NAME Product, amount Amount FROM shipment_products sp
	JOIN product p ON sp.product_id = p.id
	WHERE shipment_id = p_id;
END */$$
DELIMITER ;

/* Procedure structure for procedure `UserShipments` */

/*!50003 DROP PROCEDURE IF EXISTS  `UserShipments` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `UserShipments`(IN p_oib varchar(11))
BEGIN

	select
	ShipmentID, STATUS, Creation_Date, Delivery_Date,
	User_Name, User_Surname, User_Phone, User_Email,
	Delivery_City, Delivery_Street, Delivery_Address, Delivery_County,
	Receipt_City, Receipt_Street, Receipt_Address, Receipt_County
	from ShipmentView
	where OIB = p_oib;
END */$$
DELIMITER ;

/*Table structure for table `shipmentview` */

DROP TABLE IF EXISTS `shipmentview`;

/*!50001 DROP VIEW IF EXISTS `shipmentview` */;
/*!50001 DROP TABLE IF EXISTS `shipmentview` */;

/*!50001 CREATE TABLE  `shipmentview`(
 `ShipmentID` int(11) ,
 `STATUS` varchar(32) ,
 `Creation_Date` date ,
 `Delivery_Date` date ,
 `OIB` varchar(11) ,
 `User_Name` varchar(256) ,
 `User_Surname` varchar(256) ,
 `User_Phone` varchar(15) ,
 `User_Email` varchar(320) ,
 `Delivery_City` varchar(256) ,
 `Delivery_Street` varchar(256) ,
 `Delivery_Address` varchar(8) ,
 `Delivery_County` varchar(256) ,
 `Receipt_City` varchar(256) ,
 `Receipt_Street` varchar(256) ,
 `Receipt_Address` varchar(8) ,
 `Receipt_County` varchar(256) 
)*/;

/*View structure for view shipmentview */

/*!50001 DROP TABLE IF EXISTS `shipmentview` */;
/*!50001 DROP VIEW IF EXISTS `shipmentview` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `shipmentview` AS select `s`.`id` AS `ShipmentID`,`s`.`status` AS `STATUS`,`s`.`creation_date` AS `Creation_Date`,`s`.`delivery_date` AS `Delivery_Date`,`u`.`oib` AS `OIB`,`u`.`name` AS `User_Name`,`u`.`surname` AS `User_Surname`,`u`.`phone_number` AS `User_Phone`,`u`.`email` AS `User_Email`,`dc`.`name` AS `Delivery_City`,`s`.`delivery_street_name` AS `Delivery_Street`,`s`.`delivery_house_number` AS `Delivery_Address`,`d`.`name` AS `Delivery_County`,`rc`.`name` AS `Receipt_City`,`s`.`receipt_street_name` AS `Receipt_Street`,`s`.`receipt_house_number` AS `Receipt_Address`,`r`.`name` AS `Receipt_County` from (((((`shipment` `s` join `user` `u` on(`s`.`user_oib` = `u`.`oib`)) join `city` `dc` on(`s`.`delivery_city_id` = `dc`.`id`)) join `county` `d` on(`dc`.`county_id` = `d`.`id`)) join `city` `rc` on(`s`.`receipt_city_id` = `rc`.`id`)) join `county` `r` on(`rc`.`county_id` = `r`.`id`)) order by `s`.`id` */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
