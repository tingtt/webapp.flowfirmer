import { GetServerSideProps, NextPage } from "next";
import Layout from "../../components/app/Layout";

const appIndex: NextPage = () => {
    return (
        <Layout />
    );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     if (context.res) {
//         // Without token makes page redirection.
//         if (context.query.token == undefined || context.query.token == "") {
//             context.res.statusCode = 302;
//             context.res.setHeader('location', '/login');
//             context.res.end();
//         }
//     }
//     return { props: {} };
// }

export default appIndex