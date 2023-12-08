import React, { useState, useEffect, useCallback } from 'react';
import PetCard from '../shared/PetCard';
import SideBarFilter from './SideBarFilter';
import { petAPIService } from '../../services/petAPIService';
import SideBarSorter from './SideBarSorter';
import Pagination from 'react-bootstrap/Pagination';

const PAGE_SIZE = 10; // Define the number of items per page

const PetListingsPage = ({ manageFlag = false, defaultFilters = {} }) => {
    const [pets, setPets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const petAPI = petAPIService();
    const [sortOrder, setSortOrder] = useState('-birth_date');

    const updateFilters = useCallback((newFilters) => {
        fetchPetList(newFilters, currentPage);
    }, []);

    const fetchPetList = useCallback(async (filters = defaultFilters, page = currentPage, sort = sortOrder) => {
        try {
            // Ensure sortOrder is included under the 'ordering' key
            console.log("Fetching with Sort Order: ", sort, " Page: ", page);
            const queryParams = { ...filters };
            console.log(queryParams)
            const response = await petAPI.getPetList(queryParams, page, sort);
            if (response.success) {
                setPets(response.data.results.map((pet) => ({id: pet.id, form: pet.form})));
                setTotalPages(Math.ceil(response.data.count / PAGE_SIZE));
            }
        } catch (error) {
            console.error('Error fetching pet list:', error);
        }
    }, [petAPI, currentPage, sortOrder]);

    useEffect(() => {
        fetchPetList(defaultFilters, currentPage, sortOrder);
    }, [sortOrder, currentPage]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    let paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
                {number}
            </Pagination.Item>
        );
    }

    return (
        <div>
            <div className="container main-content">
                <h2 className="mb-4">{manageFlag ? "Our Pets" : "Adoption Listings"}</h2>
                <div className="row">
                    <div className="col-md-3 filter-sidebar">
                        <SideBarSorter sortOrder={sortOrder} setSortOrder={setSortOrder} />
                        <SideBarFilter updateFilters={updateFilters} />
                    </div>
                    <div className="col-md-9">
                        <div className="row no-gutters">
                            {pets.map((pet) => (
                                <PetCard manageFlag={manageFlag} key={pet.id} petId={pet.id} formId={pet.form} />
                            ))}
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <Pagination>{paginationItems}</Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetListingsPage;
