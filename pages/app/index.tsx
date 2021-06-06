//認証失敗時や未ログインじにLoginページにリダイレクト
// import Router from "next/router";
// const redirectToLoginPage = () => {
//     Router.push('/login');
// }

import Layout from "../../components/app/Layout";

const appIndex = () => {
    return (
        <Layout />
        // <button onClick={redirectToLoginPage}>認証失敗時動作</button>
    );
}

export default appIndex