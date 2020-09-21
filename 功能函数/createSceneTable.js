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