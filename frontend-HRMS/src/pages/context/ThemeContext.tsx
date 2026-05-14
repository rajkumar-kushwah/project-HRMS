import { createContext,useContext, useState } from "react";


const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({children }:{children:React.ReactNode }) => {
    const [dark, setDark] = useState(false);

    return (
        <ThemeContext.Provider value={{ dark, setDark}}>
            {children}
        </ThemeContext.Provider>
    )


}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider.");
    }
    return context;
}


