import { GetServerSideProps } from "next";
import Layout from "../../components/app/Layout";
import AppDataManager from "../../lib/app/appDataManager";

interface ServerSideIndexProps{
    token: string
}

const appIndex = ({ token }: ServerSideIndexProps) => {
    console.log(`appIndex: ${token}`);
    const appDataManager: AppDataManager = (() => {
        try {
            return  AppDataManager.generateInstance(token);
        } catch (e) {
            return  AppDataManager.getInstance();
        }
    })();
    AppDataManager.validateToken(token);
    return (
        <Layout />
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    var token: string = "";
    if (context.res) {
        // Without token makes page redirection.
        if ((context.query.token == undefined || context.query.token == "") && (context.req.headers.cookie == undefined || context.req.headers.cookie == "" || !context.req.headers.cookie.includes("token="))) {
            context.res.statusCode = 302;
            context.res.setHeader('location', '/login');
            context.res.end();
        } else {
            token = typeof context.query.token === "string" && context.query.token != "" ?
                context.query.token
                :
                context.req.headers.cookie!.split('; ').find((row: string) => row.startsWith('token'))!.split('=')[1];
        }
    }
    return { props: { token } };
}

export default appIndex