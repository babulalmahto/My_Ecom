import Mailgen from "mailgen";
let mailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "My_Ecom",
        link: "https://github.com/babulalmahto/My_Ecom",
    },
});
export default mailGenerator;