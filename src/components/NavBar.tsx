import battleIcon from "../assets/battleIcon.png";
/*
This component will handle the main logic for switching pages
*/
interface NavBarProps {
	setPage: React.Dispatch<React.SetStateAction<string>>;
	pages: string[];
}
const NavBar = ({ setPage, pages }: NavBarProps) => {
	return (
		<>
			<div className="bg-dark d-flex flex-row justify-content-between  align-items-center">
				<nav
					className="navbar navbar-expand-md navbar-dark "
					style={{ height: "10vh" }}
				>
					<ul className="navbar-nav" style={{ color: "gray" }} key={"Nav-ul"}>
						{pages.map((page) => (
							<li
								className="nav-item m-2"
								onClick={() => setPage(page)}
								key={page}
							>
								{page}
							</li>
						))}
					</ul>
				</nav>
				<img
					src={battleIcon}
					alt="Logo"
					style={{ width: "auto", height: "50px" }}
				/>
			</div>
		</>
	);
};

export default NavBar;
