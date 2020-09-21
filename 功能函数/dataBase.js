/**
 * @description 创建风控白名单
 * @param {String} item_type - 白名单类型 值为1/2/3  1-sku/2-券/3-pin
 * @param {String} item_value - 白名单的值
 * @param {Number} sceneid - 场景值 0-表示全场景
 * @param {Number} start_time - 有效期开始时间，秒级时间戳
 * @param {Number} end_time - 有效期结束时间，秒级时间戳
 * @param {Number} apply_time - 该条记录操作时间，秒级时间戳
 * @param {Number} invalid - 是否失效，值为1表示失效，其它表示不失效，该值由产品控制，与有效期无关
 * @param {String} op_user - 操作人员erp
 * @param {String} apply_user - 申请人员erp
 * @PRIMARY 主键：item_type、item_value、sceneid、start_time、end_time
 */

const createWhiteList =
		`CREATE TABLE risk_management_white_list (
		item_value VARCHAR(100) NOT NULL, 
		item_type VARCHAR(25) NOT NULL,
		sceneid INT(11) NOT NULL,
		start_time INT(11) NOT NULL,
		end_time INT(11) NOT NULL,
		apply_time INT(11) NOT NULL,
		invalid INT(1),
		op_user VARCHAR(100),
		apply_user VARCHAR(100),
		PRIMARY KEY(item_value,item_type,sceneid,start_time,end_time)
		);`;

/**
 * @description 创建风控黑名单
 * @param {String} item_type - 白名单类型 值为4/5  4-sku/5-pin
 * 其它和风控白名单一样
 */
const createBlackList =
		`CREATE TABLE risk_management_black_list (
		item_value VARCHAR(100) NOT NULL, 
		item_type VARCHAR(25) NOT NULL,
		sceneid INT(11) NOT NULL,
		start_time INT(11) NOT NULL,
		end_time INT(11) NOT NULL,
		apply_time INT(11) NOT NULL,
		invalid INT(1),
		op_user VARCHAR(100),
		apply_user VARCHAR(100),
		PRIMARY KEY(item_value,item_type,sceneid,start_time,end_time)
		);`;

/**
 * @description 申请添加白名单记录表
 * @param {String} applyid - 申请记录id
 * @param {String} item_type - 白名单类型 1-sku/2-券/3-pin
 * @param {String} item_value - 白名单的值
 * @param {Number} sceneid - 场景值
 * @param {Number} start_time - 有效期开始时间，秒级时间戳
 * @param {Number} end_time - 有效期结束时间，秒级时间戳
 * @param {Number} apply_time - 申请时间，秒级时间戳
 * @param {Number} pass_result - 审核结果，0-未审核 100-通过 200-驳回
 * @param {String} check_msg - 审核原因
 * @param {String} op_user - 操作人员erp
 * @param {String} apply_user - 申请人员erp
 * @PRIMARY 主键：applyid
 */
const createApplyList =
		`CREATE TABLE risk_management_apply_list (
		applyid INT AUTO_INCREMENT,
		item_value VARCHAR(10000) NOT NULL, 
		item_type VARCHAR(25) NOT NULL,
		sceneid VARCHAR(200) NOT NULL,
		start_time INT(11) NOT NULL,
		end_time INT(11) NOT NULL,
		apply_time INT(11) NOT NULL,
		pass_result INT(11) NOT NULL DEFAULT 0,
		check_msg VARCHAR(500),
		op_user VARCHAR(100),
		apply_user VARCHAR(100),
		PRIMARY KEY(applyid)
		);`;

/**
 * @description 场景值存储列表
 * @param {Number} sceneid - 场景id
 * @param {String} scene_name - 场景名称
 * @param {Number} invalid - 可用该字段判断该场景是否无效 1-无效 0-有效
 * @PRIMARY 主键：applyid
 */
const createSceneidsList =
		`CREATE TABLE risk_management_sceneid_list (
		sceneid INT NOT NULL,
		scene_name VARCHAR(100) NOT NULL,
		invalid INT DEFAULT 0 NOT NULL,
		PRIMARY KEY(sceneid)
		);`;