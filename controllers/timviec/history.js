const { calculateBaseTimeOnline, handleHistoryLogin } = require("./history/PointTimeOnline");
const calculatePointSeen = require("./history/PointSeen");
const calculatePointSeenNew = require("./history/PointSeenNew");
const calculatePointOrder = require("./history/PointOrder");
const calculatePointShareNew = require("./history/PointShareNew");
const calculatePointShareUser = require("./history/PointShareUser");
const { calculatePointNextPage, updateEndTimeNextPage } = require("./history/PointNextPage");
const exchangePointHistory = require("./history/ExchangePointHistory");
const exchangeNumberPoints = require("./history/ExchangeNumberPoint");
const usePoint = require("./history/PointUsePoint");
const changeIdChat = require("./history/ChangeIdChat");
const countComment = require("./history/CountComments");
const evaluateContentNew = require("./history/EvaluateContentNew");
const { startSee, endSee } = require("./history/PointStartSee");
const { startSeeByEm, endSeeByEm } = require("./history/HandlePointSee");
const { calculatePointNTDComment } = require("./history/PointNTDComment");
const takeUser = require("./history/TakeUser");
const {
    historyAll,
    getOnsiteHistory,
    getCandidateSeen,
    getPointSeenUv,
    getListNewShare,
    getListUrlShare,
    getListUserShare,
    getListUvSeen,
    getListCommentNew,
    getListCommentNTD,
    getOnsiteData,
    getSaveExchangePoints,
    getAppliedList,
    getSeenNewsOrCompanyDetails,
    getNTDSeen,
    getDetailExChangedPoints,
    getNtdEvaluate,
    getListHistoryChat,
    calPointEvaluateCv,
    calPointChatUv,
    calPointNtdSeen,
    calPointNtdEvaluate,
    calPointSeenNewNtd,
    getListHistoryChatDetail,
    calPointSeenInfoUv,
    updateSttSeenUv,
    // updatePointTimeActive,
} = require("./history/Statistics");



module.exports = {
    calculateBaseTimeOnline,
    handleHistoryLogin,
    calculatePointSeen,
    calculatePointSeenNew,
    calculatePointOrder,
    calculatePointShareNew,
    calculatePointShareUser,
    exchangeNumberPoints,
    calculatePointNextPage,
    updateEndTimeNextPage,
    exchangePointHistory,
    usePoint,
    changeIdChat,
    countComment,
    evaluateContentNew,
    startSee,
    endSee,
    startSeeByEm,
    endSeeByEm,
    calculatePointNTDComment,
    takeUser,
    //GET DATA
    historyAll,
    getOnsiteHistory,
    getCandidateSeen,
    getPointSeenUv,
    getListNewShare,
    getListUrlShare,
    getListUserShare,
    getListUvSeen,
    getListCommentNew,
    getListCommentNTD,
    getOnsiteData,
    getSaveExchangePoints,
    getAppliedList,
    getSeenNewsOrCompanyDetails,
    getNTDSeen,
    getDetailExChangedPoints,
    getNtdEvaluate,
    getListHistoryChat,
    calPointEvaluateCv,
    calPointChatUv,
    calPointNtdSeen,
    calPointNtdEvaluate,
    calPointSeenNewNtd,
    getListHistoryChatDetail,
    calPointSeenInfoUv,
    updateSttSeenUv,
    // updatePointTimeActive,
}