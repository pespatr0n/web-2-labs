export default function Footer({ onAddTeacher }) {
    return (
    <footer>
        <div className="footer-text">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque facere, hic impedit itaque molestiae sit tempore? Ea in mollitia natus rerum voluptates. Ea ex excepturi facere tempora. Aliquid asperiores hic impedit iusto natus quaerat ratione sit? Culpa iusto optio voluptas voluptate. Enim eveniet fugit iure maiores molestiae, praesentium quia.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam eligendi illum in inventore ipsum odio officiis omnis quisquam sed tempora?</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque esse expedita id iusto mollitia, odit sint ullam veritatis vero?</p>
        </div>

        <div className="footer-bottom">
            <nav>
                <a href="#">Teachers</a>
                <a href="#">Statistics</a>
                <a href="#">Favorites</a>
                <a href="#">About</a>
            </nav>
            <button className="add-btn" onClick={onAddTeacher}>Add teacher</button>
        </div>
    </footer>
    );
}
