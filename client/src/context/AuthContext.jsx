const API_URL = "http://localhost:4000";
const AuthContext = createContext();
...
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [allUsers, setAllUsers] = useState([]);

useEffect(() => {
  const stored = localStorage.getItem("currentUser");
  ...
}, []);
const login = async (arg1, password, role) => { ... }
