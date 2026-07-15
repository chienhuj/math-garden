// 共生花園 全域共享配置 (預設資料庫金鑰與動態安全驗證)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDeLX5En1KptQznJHzsstsQr0j90WFtekY",
  databaseURL: "https://math-garden-class-default-rtdb.firebaseio.com",
  projectId: "math-garden-class",
  appId: "1:1062230339831:web:0abc2d10e2e113249f23f2"
};

/**
 * 動態從 Firebase 預設資料庫查詢該教師代碼是否在白名單中
 * @param {string} teacherId - 教師代碼
 * @param {boolean} isDefault - 是否使用預設資料庫
 * @param {HTMLElement} btn - 資料庫設定按鈕元素，用於顯示連線狀態
 * @param {function} onComplete - 查詢完畢的回呼函式，傳入 true (白名單內/自訂資料庫) 或 false (非白名單)
 */
function checkTeacherWhitelistStatus(teacherId, isDefault, btn, onComplete) {
  if (!isDefault) {
    if (onComplete) onComplete(true);
    return;
  }
  if (!teacherId) {
    if (btn) {
      btn.innerText = '🔴 資料庫未設定';
      btn.style.color = '#F44336';
    }
    if (onComplete) onComplete(false);
    return;
  }

  const tInput = teacherId.trim().toLowerCase();

  // 若尚未初始化，先以預設配置初始化
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(DEFAULT_FIREBASE_CONFIG);
    }
  } catch (err) {
    console.error("Firebase initialization failed during whitelist check", err);
    if (btn) {
      btn.innerText = '🔴 資料庫連線失敗';
      btn.style.color = '#F44336';
    }
    if (onComplete) onComplete(false);
    return;
  }

  // 查詢 system_config/whitelisted_teachers/${tInput}
  let db;
  try {
    db = firebase.database();
  } catch (err) {
    console.error("Firebase database initialization failed", err);
    if (btn) {
      btn.innerText = '🔴 資料庫連線失敗';
      btn.style.color = '#F44336';
    }
    if (onComplete) onComplete(false);
    return;
  }

  db.ref(`system_config/whitelisted_teachers/${tInput}`).once('value')
    .then((snap) => {
      if (snap.val() === true) {
        if (btn) {
          btn.innerText = '🟢 預設資料庫已連線';
          btn.style.color = '#4CAF50';
        }
        if (onComplete) onComplete(true);
      } else {
        if (btn) {
          btn.innerText = '🔴 資料庫未設定';
          btn.style.color = '#F44336';
        }
        if (onComplete) onComplete(false);
      }
    })
    .catch((err) => {
      console.error("Firebase whitelist query failed", err);
      if (btn) {
        btn.innerText = '🔴 資料庫連線失敗';
        btn.style.color = '#F44336';
      }
      if (onComplete) onComplete(false);
    });
}
