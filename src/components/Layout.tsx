
// import '../assets/consumer.css';

const Section = (props: any) => {
    return <section className={props.classNameName}>{props.children}</section>;
};

const Layout = (props: any) => {
    return (<>
        <Section className={props.className}>
            {props.children}
        </Section>
    </>)

}
export default Layout;