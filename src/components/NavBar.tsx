import battleIcon from "../assets/battleIcon.png";
import infoIcon from "../assets/infoIcon.svg";
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

				<div
					className="d-flex flex-row justify-content-around align-items-center"
					style={{}}
				>
					<a
						href="https://writinghusky.github.io/monster-battler/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src={infoIcon}
							alt="Info Icon"
							style={{ width: "auto", height: "50px", marginRight: "70px" }}
						/>
					</a>
					<img
						src={battleIcon}
						alt="Logo"
						style={{ width: "auto", height: "50px" }}
					/>
				</div>
			</div>
		</>
	);
};

export default NavBar;
